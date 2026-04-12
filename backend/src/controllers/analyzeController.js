const analyzeService = require('../services/analyzeService')
const History = require('../models/History')

const REUSE_LOOKUP_LIMIT = 40

function normalizeForMatch(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

function buildReusableAnalysis(historyRecord) {
  if (!historyRecord) {
    return null
  }

  if (!historyRecord.turkishExplanation || !historyRecord.notes) {
    return null
  }

  return {
    category: historyRecord.category,
    shortSummary: historyRecord.shortSummary,
    turkishExplanation: historyRecord.turkishExplanation,
    possibleCauses: Array.isArray(historyRecord.possibleCauses) ? historyRecord.possibleCauses : [],
    solutionSteps: Array.isArray(historyRecord.solutionSteps) ? historyRecord.solutionSteps : [],
    exampleFixCode: historyRecord.exampleFixCode || '',
    notes: historyRecord.notes,
  }
}

async function findReusableAnalysis(errorMessage, codeSnippet) {
  const normalizedError = normalizeForMatch(errorMessage)
  const normalizedSnippet = normalizeForMatch(codeSnippet)

  if (!normalizedError) {
    return null
  }

  const candidates = await History.find({ errorMessage: { $exists: true } })
    .sort({ createdAt: -1 })
    .limit(REUSE_LOOKUP_LIMIT)
    .lean()

  const matchedRecord = candidates.find((candidate) => {
    const candidateError = normalizeForMatch(candidate.errorMessage)
    const candidateSnippet = normalizeForMatch(candidate.codeSnippet)

    if (candidateError !== normalizedError) {
      return false
    }

    if (normalizedSnippet) {
      return candidateSnippet === normalizedSnippet
    }

    return !candidateSnippet
  })

  return buildReusableAnalysis(matchedRecord)
}

async function analyzeError(req, res) {
  try {
    const { errorMessage, codeSnippet } = req.body

    // Validation zaten route middleware'de yapılıyor, ama ekstra kontrol
    if (!errorMessage || errorMessage.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Hata mesajı boş bırakılamaz.',
      })
    }

    let analysis = null

    try {
      const reusableAnalysis = await findReusableAnalysis(errorMessage, codeSnippet)
      if (reusableAnalysis) {
        analysis = reusableAnalysis
      }
    } catch (reuseError) {
      console.warn('[analyze] Tekrar kullanim kontrolu basarisiz:', reuseError.message)
    }

    if (!analysis) {
      analysis = await analyzeService.analyzeError(errorMessage, codeSnippet)
    }

    let historyId = null

    // Analiz sonucu olusunca gecmise kaydet (kayit hatasi analiz akisini bozmaz)
    try {
      const createdHistory = await History.create({
        errorMessage,
        codeSnippet: codeSnippet || '',
        category: analysis.category,
        shortSummary: analysis.shortSummary,
        turkishExplanation: analysis.turkishExplanation || '',
        possibleCauses: Array.isArray(analysis.possibleCauses) ? analysis.possibleCauses : [],
        solutionSteps: Array.isArray(analysis.solutionSteps) ? analysis.solutionSteps : [],
        exampleFixCode: analysis.exampleFixCode || '',
        notes: analysis.notes || '',
      })

      historyId = createdHistory._id?.toString() || null
    } catch (historyError) {
      console.warn('[history] Kayit olusturulamadi:', historyError.message)
    }

    res.json({
      success: true,
      data: {
        ...analysis,
        historyId,
      },
    })
  } catch (error) {
    console.error('Analyze controller hatası:', error)
    res.status(500).json({
      success: false,
      error: 'Analiz sırasında bir hata oluştu.',
    })
  }
}

module.exports = {
  analyzeError,
}
