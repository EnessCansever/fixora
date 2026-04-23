export const config = {
  runtime: 'edge',
}

const SITE_NAME = 'Fixora'
const SITE_ORIGIN = 'https://getfixora.dev'
const DEFAULT_BACKEND_API_URL = 'https://fixora-api-loyo.onrender.com/api'
const CATEGORY_LABELS = {
  'Type Error': 'Tip Hatası',
  'Reference Error': 'Referans Hatası',
  'Syntax Error': 'Sözdizimi Hatası',
  'React Error': 'React Hatası',
  'API / Network Error': 'API / Ağ Hatası',
  'Build Tool Error': 'Build Aracı Hatası',
  Unknown: 'Bilinmeyen',
}

const FALLBACK_TITLE = 'Paylaşılan Analiz | Fixora'
const FALLBACK_DESCRIPTION = 'Fixora ile paylaşılan bir hata analizini görüntüle.'
const NOT_FOUND_DESCRIPTION = 'Paylaşılan analiz bulunamadı.'
const UNAVAILABLE_DESCRIPTION = 'Paylaşılan analiz şu anda yüklenemiyor.'

function getBackendApiBaseUrl() {
  const runtimeEnv = typeof process !== 'undefined' && process.env ? process.env : {}
  const rawValue = String(runtimeEnv.VITE_API_BASE_URL || runtimeEnv.API_BASE_URL || DEFAULT_BACKEND_API_URL).trim()
  return rawValue.replace(/\/+$/, '')
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function truncateText(value, maxLength) {
  const normalizedValue = normalizeText(value)

  if (!normalizedValue) {
    return ''
  }

  if (normalizedValue.length <= maxLength) {
    return normalizedValue
  }

  return `${normalizedValue.slice(0, maxLength - 1).trimEnd()}…`
}

function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category || 'Paylaşılan Analiz'
}

function buildMetadata(analysis, slug) {
  const normalizedSlug = normalizeText(slug)
  const canonicalUrl = normalizedSlug ? `${SITE_ORIGIN}/share/${normalizedSlug}` : `${SITE_ORIGIN}/share/`
  const category = getCategoryLabel(analysis?.category)
  const shortSummary = truncateText(analysis?.shortSummary, 80)
  const errorMessage = truncateText(analysis?.errorMessage, 140)

  const titleBase = shortSummary ? `${category}: ${shortSummary}` : category
  const title = truncateText(`${titleBase} | ${SITE_NAME}`, 70) || FALLBACK_TITLE
  const descriptionSource = errorMessage || shortSummary || FALLBACK_DESCRIPTION

  return {
    title,
    description: truncateText(descriptionSource, 160) || FALLBACK_DESCRIPTION,
    canonicalUrl,
  }
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function replaceTag(html, pattern, replacement) {
  return html.replace(pattern, replacement)
}

function injectRobots(html, content) {
  const robotsTag = `<meta name="robots" content="${content}" />`

  if (html.includes('<meta name="robots"')) {
    return replaceTag(
      html,
      /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
      robotsTag,
    )
  }

  return html.replace('<meta name="theme-color" content="#8B5CF6" />', `${robotsTag}\n    <meta name="theme-color" content="#8B5CF6" />`)
}

function injectMetadata(html, metadata) {
  let output = html
  output = replaceTag(output, /<title>.*?<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`)
  output = replaceTag(output, /<link rel="canonical" href="[^"]*"\s*\/>/i, `<link rel="canonical" href="${escapeHtml(metadata.canonicalUrl)}" />`)
  output = replaceTag(output, /<meta name="description" content="[^"]*"\s*\/>/i, `<meta name="description" content="${escapeHtml(metadata.description)}" />`)
  output = replaceTag(output, /<meta property="og:url" content="[^"]*"\s*\/>/i, `<meta property="og:url" content="${escapeHtml(metadata.canonicalUrl)}" />`)
  output = replaceTag(output, /<meta property="og:title" content="[^"]*"\s*\/>/i, `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`)
  output = replaceTag(output, /<meta property="og:description" content="[^"]*"\s*\/>/i, `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`)
  output = replaceTag(output, /<meta name="twitter:url" content="[^"]*"\s*\/>/i, `<meta name="twitter:url" content="${escapeHtml(metadata.canonicalUrl)}" />`)
  output = replaceTag(output, /<meta name="twitter:title" content="[^"]*"\s*\/>/i, `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`)
  output = replaceTag(output, /<meta name="twitter:description" content="[^"]*"\s*\/>/i, `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`)

  return output
}

async function fetchShareData(slug) {
  const backendBaseUrl = getBackendApiBaseUrl()
  const response = await fetch(`${backendBaseUrl}/public/history/${encodeURIComponent(slug)}`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (response.status === 404) {
    return {
      status: 404,
      data: null,
    }
  }

  if (!response.ok) {
    return {
      status: 503,
      data: null,
    }
  }

  const payload = await response.json().catch(() => null)

  if (!payload?.data) {
    return {
      status: 503,
      data: null,
    }
  }

  return {
    status: 200,
    data: payload.data,
  }
}

async function fetchBaseHtml(request) {
  const indexUrl = new URL('/index.html', request.url)
  const response = await fetch(indexUrl.toString(), {
    headers: {
      Accept: 'text/html',
    },
  })

  return response.text()
}

function buildErrorHtml(baseHtml, title, description, robotsContent, canonicalUrl) {
  let html = baseHtml
  html = injectMetadata(html, {
    title,
    description,
    canonicalUrl: canonicalUrl || `${SITE_ORIGIN}/share/`,
  })
  html = injectRobots(html, robotsContent)
  return html
}

export default async function handler(request) {
  const url = new URL(request.url)
  const slug = normalizeText(url.searchParams.get('slug'))

  if (!slug) {
    const baseHtml = await fetchBaseHtml(request)
    const html = buildErrorHtml(baseHtml, FALLBACK_TITLE, NOT_FOUND_DESCRIPTION, 'noindex, nofollow')

    return new Response(html, {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  }

  const shareResult = await fetchShareData(slug)
  const baseHtml = await fetchBaseHtml(request)

  if (shareResult.status === 404) {
    const html = buildErrorHtml(baseHtml, FALLBACK_TITLE, NOT_FOUND_DESCRIPTION, 'noindex, nofollow')

    return new Response(html, {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  }

  if (!shareResult.data) {
    const html = buildErrorHtml(baseHtml, FALLBACK_TITLE, UNAVAILABLE_DESCRIPTION, 'noindex, nofollow')

    return new Response(html, {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  }

  const metadata = buildMetadata(shareResult.data, slug)
  const html = injectMetadata(baseHtml, metadata)

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
    },
  })
}
