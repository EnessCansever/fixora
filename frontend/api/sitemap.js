export const config = {
  runtime: 'edge',
}

const SITE_ORIGIN = 'https://getfixora.dev'
const DEFAULT_BACKEND_API_URL = 'https://fixora-api-loyo.onrender.com/api'

function getBackendApiBaseUrl() {
  const runtimeEnv = typeof process !== 'undefined' && process.env ? process.env : {}
  const rawValue = String(runtimeEnv.VITE_API_BASE_URL || runtimeEnv.API_BASE_URL || DEFAULT_BACKEND_API_URL).trim()
  return rawValue.replace(/\/+$/, '')
}

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatLastmod(value) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

function buildUrlEntry(loc, lastmod) {
  const parts = [`<loc>${escapeXml(loc)}</loc>`]

  if (lastmod) {
    parts.push(`<lastmod>${escapeXml(lastmod)}</lastmod>`)
  }

  return `  <url>\n    ${parts.join('\n    ')}\n  </url>`
}

function buildSitemapXml(shareItems = []) {
  const urls = [buildUrlEntry(`${SITE_ORIGIN}/`)]

  for (const item of shareItems) {
    const shareSlug = String(item?.shareSlug || '').trim()

    if (!shareSlug) {
      continue
    }

    const loc = `${SITE_ORIGIN}/share/${shareSlug}`
    const lastmod = formatLastmod(item?.updatedAt || item?.createdAt)
    urls.push(buildUrlEntry(loc, lastmod))
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

async function fetchPublicSitemap() {
  const backendBaseUrl = getBackendApiBaseUrl()
  const response = await fetch(`${backendBaseUrl}/public/sitemap`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    return []
  }

  const payload = await response.json().catch(() => null)
  return Array.isArray(payload?.data) ? payload.data : []
}

export default async function handler() {
  const shareItems = await fetchPublicSitemap().catch(() => [])
  const xml = buildSitemapXml(shareItems)

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
    },
  })
}
