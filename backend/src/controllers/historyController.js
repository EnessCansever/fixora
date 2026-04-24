const History = require('../models/History')
const crypto = require('crypto')
const { loadEnvConfig } = require('../config/env')

const env = loadEnvConfig()

const DEFAULT_HISTORY_PAGE = 1
const DEFAULT_HISTORY_LIMIT = 8
const MAX_HISTORY_LIMIT = 24
const MAX_HISTORY_SEARCH_LENGTH = 120

const allowedCategories = new Set([
  'Type Error',
  'Reference Error',
  'Syntax Error',
  'React Error',
  'API / Network Error',
  'Build Tool Error',
  'Unknown',
])

const allowedSorts = new Set(['newest', 'oldest'])
const SHARE_SLUG_BYTES = 9
const SHARE_SLUG_MAX_ATTEMPTS = 5

function getFrontendBaseUrl() {
  if (Array.isArray(env.frontendOrigins) && env.frontendOrigins.length > 0) {
    return env.frontendOrigins[0]
  }

  if (env.nodeEnv === 'production') {
    return 'https://getfixora.dev'
  }

  return 'http://localhost:5173'
}

function buildShareUrl(slug) {
  const baseUrl = getFrontendBaseUrl().replace(/\/+$/, '')
  return `${baseUrl}/share/${slug}`
}

function generateShareSlug() {
  return crypto.randomBytes(SHARE_SLUG_BYTES).toString('base64url')
}

async function createUniqueShareSlug() {
  for (let attempt = 0; attempt < SHARE_SLUG_MAX_ATTEMPTS; attempt += 1) {
    const slug = generateShareSlug()
    const existingRecord = await History.findOne({ shareSlug: slug }).select('_id').lean()

    if (!existingRecord) {
      return slug
    }
  }

  return null
}

function parsePositiveInteger(value, fallbackValue) {
  const parsedValue = Number.parseInt(value, 10)

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return fallbackValue
  }

  return parsedValue
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildHistoryQuery({ userId, search, category }) {
  const query = {
    user: userId,
  }

  if (category) {
    query.category = category
  }

  if (search) {
    const escapedSearch = escapeRegex(search)

    query.$or = [
      { errorMessage: { $regex: escapedSearch, $options: 'i' } },
      { shortSummary: { $regex: escapedSearch, $options: 'i' } },
      { category: { $regex: escapedSearch, $options: 'i' } },
    ]
  }

  return query
}

async function getHistory(req, res) {
  try {
    const requestedPage = parsePositiveInteger(req.query.page, DEFAULT_HISTORY_PAGE)
    const requestedLimit = Math.min(
      parsePositiveInteger(req.query.limit, DEFAULT_HISTORY_LIMIT),
      MAX_HISTORY_LIMIT,
    )
    const rawSearch = typeof req.query.search === 'string' ? req.query.search.trim() : ''
    const rawCategory = typeof req.query.category === 'string' ? req.query.category.trim() : ''
    const rawSort = typeof req.query.sort === 'string' ? req.query.sort.trim().toLowerCase() : 'newest'

    if (rawSearch.length > MAX_HISTORY_SEARCH_LENGTH) {
      return res.status(400).json({
        success: false,
        error: `Arama metni en fazla ${MAX_HISTORY_SEARCH_LENGTH} karakter olabilir.`,
      })
    }

    if (rawCategory && !allowedCategories.has(rawCategory)) {
      return res.status(400).json({
        success: false,
        error: 'Geçersiz kategori filtresi.',
      })
    }

    const sort = allowedSorts.has(rawSort) ? rawSort : 'newest'
    const search = rawSearch
    const category = rawCategory
    const query = buildHistoryQuery({
      userId: req.user.id,
      search,
      category,
    })

    const totalItems = await History.countDocuments(query)
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / requestedLimit) : 0
    const page = totalPages > 0 ? Math.min(requestedPage, totalPages) : DEFAULT_HISTORY_PAGE
    const sortQuery = sort === 'oldest' ? { createdAt: 1, _id: 1 } : { createdAt: -1, _id: -1 }

    const history = await History.find(query)
      .sort(sortQuery)
      .skip((page - 1) * requestedLimit)
      .limit(requestedLimit)
      .select('errorMessage codeSnippet category shortSummary createdAt')
      .lean()

    res.json({
      success: true,
      data: {
        items: history,
        pagination: {
          page,
          limit: requestedLimit,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        filters: {
          search,
          category,
          sort,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Geçmiş kayıtları getirilemedi.',
    })
  }
}

async function getHistoryById(req, res) {
  try {
    const item = await History.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Geçmiş kaydı bulunamadı.',
      })
    }

    res.json({
      success: true,
      data: item,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Kayit detayi getirilemedi.',
    })
  }
}

async function deleteHistoryById(req, res) {
  try {
    const deletedItem = await History.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        error: 'Silinecek geçmiş kaydı bulunamadı.',
      })
    }

    res.json({
      success: true,
      message: 'Geçmiş kaydı silindi.',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Geçmiş kaydı silinemedi.',
    })
  }
}

async function submitHistoryFeedback(req, res) {
  try {
    const { id } = req.params
    const { feedbackType } = req.body

    if (feedbackType !== 'positive' && feedbackType !== 'negative') {
      return res.status(400).json({
        success: false,
        error: 'feedbackType sadece positive veya negative olabilir.',
      })
    }

    const updateField = feedbackType === 'positive' ? 'positiveFeedbackCount' : 'negativeFeedbackCount'

    const updatedItem = await History.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id,
      },
      { $inc: { [updateField]: 1 } },
      { returnDocument: 'after', runValidators: true },
    ).select('_id positiveFeedbackCount negativeFeedbackCount')

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        error: 'Geçmiş kaydı bulunamadı.',
      })
    }

    return res.json({
      success: true,
      data: {
        id: updatedItem._id,
        positiveFeedbackCount: updatedItem.positiveFeedbackCount,
        negativeFeedbackCount: updatedItem.negativeFeedbackCount,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Geri bildirim güncellenemedi.',
    })
  }
}

async function shareHistoryById(req, res) {
  try {
    const { id } = req.params

    const historyItem = await History.findOne({
      _id: id,
      user: req.user.id,
    }).select('_id isShared shareSlug')

    if (!historyItem) {
      return res.status(404).json({
        success: false,
        error: 'Paylaşılacak geçmiş kaydı bulunamadı.',
      })
    }

    if (historyItem.isShared && historyItem.shareSlug) {
      return res.json({
        success: true,
        data: {
          shareUrl: buildShareUrl(historyItem.shareSlug),
        },
      })
    }

    const shareSlug = await createUniqueShareSlug()

    if (!shareSlug) {
      return res.status(500).json({
        success: false,
        error: 'Paylaşım linki oluşturulamadı. Lütfen tekrar deneyin.',
      })
    }

    historyItem.isShared = true
    historyItem.shareSlug = shareSlug
    await historyItem.save()

    return res.json({
      success: true,
      data: {
        shareUrl: buildShareUrl(shareSlug),
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Paylaşım linki oluşturulamadı.',
    })
  }
}

async function getPublicSharedHistory(req, res) {
  try {
    const slug = String(req.params.slug || '').trim()

    if (!slug || slug.length > 64) {
      return res.status(404).json({
        success: false,
        error: 'Paylaşılan analiz bulunamadı.',
      })
    }

    const sharedItem = await History.findOne({
      shareSlug: slug,
      isShared: true,
    })
      .select('category shortSummary errorMessage codeSnippet turkishExplanation possibleCauses solutionSteps exampleFixCode notes createdAt')
      .lean()

    if (!sharedItem) {
      return res.status(404).json({
        success: false,
        error: 'Paylaşılan analiz bulunamadı.',
      })
    }

    return res.json({
      success: true,
      data: sharedItem,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Paylaşılan analiz alınamadı.',
    })
  }
}

async function getPublicSitemap(req, res) {
  try {
    const sitemapItems = await History.find({
      isShared: true,
      shareSlug: { $exists: true, $ne: '' },
    })
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(1000)
      .select('shareSlug updatedAt createdAt')
      .lean()

    return res.json({
      success: true,
      data: sitemapItems,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Site haritası alınamadı.',
    })
  }
}

async function deleteAllHistory(req, res) {
  try {
    const result = await History.deleteMany({
      user: req.user.id,
    })

    return res.json({
      success: true,
      message: 'Tüm geçmiş kayıtları silindi.',
      data: {
        deletedCount: result.deletedCount || 0,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Geçmiş kayıtları silinemedi.',
    })
  }
}

async function getSimilarHistory(req, res) {
  try {
    const { query } = req.query

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Arama sorgusu boş olamaz.',
      })
    }

    const searchQuery = query.trim().substring(0, MAX_HISTORY_SEARCH_LENGTH)
    const escapedSearchQuery = escapeRegex(searchQuery)
    const similarItems = await History.find({
      isShared: true,
      user: { $ne: req.user.id },
      errorMessage: { $regex: escapedSearchQuery, $options: 'i' },
    })
      .select('category shortSummary shareSlug')
      .limit(3)
      .lean()

    return res.json({
      success: true,
      data: similarItems,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Benzer hatalar alınamadı.',
    })
  }
}

module.exports = {
  getHistory,
  getHistoryById,
  deleteHistoryById,
  submitHistoryFeedback,
  shareHistoryById,
  getPublicSharedHistory,
  getPublicSitemap,
  deleteAllHistory,
  getSimilarHistory,
}
