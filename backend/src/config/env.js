function normalizeNodeEnv(value) {
  const normalized = (value || 'development').trim().toLowerCase()
  return normalized || 'development'
}

function normalizePort(value) {
  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 5000
}

function parseFrontendOrigins(value) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

function loadEnvConfig() {
  const nodeEnv = normalizeNodeEnv(process.env.NODE_ENV)
  const port = normalizePort(process.env.PORT)
  const mongoUri = process.env.MONGODB_URI?.trim()
  const geminiApiKey = process.env.GEMINI_API_KEY?.trim()
  const frontendOrigins = parseFrontendOrigins(process.env.FRONTEND_ORIGIN)

  const errors = []

  if (!mongoUri) {
    errors.push('MONGODB_URI zorunludur.')
  }

  if (!geminiApiKey) {
    errors.push('GEMINI_API_KEY zorunludur.')
  }

  if (nodeEnv === 'production' && frontendOrigins.length === 0) {
    errors.push('Production ortaminda FRONTEND_ORIGIN zorunludur.')
  }

  if (errors.length > 0) {
    throw new Error(`[env] Yapılandırma hatası:\n- ${errors.join('\n- ')}`)
  }

  return {
    nodeEnv,
    port,
    mongoUri,
    geminiApiKey,
    frontendOrigins,
  }
}

module.exports = {
  loadEnvConfig,
}