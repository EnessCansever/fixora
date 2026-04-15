import { buildApiUrl } from './apiConfig'

const NETWORK_ERROR_MESSAGE = 'Sunucuya ulaşılamadı. İnternet bağlantınızı veya ağ erişimini kontrol edin.'
const INVALID_RESPONSE_MESSAGE = 'Sunucudan geçersiz bir yanıt alındı.'

async function parseResponseBody(response) {
  const rawBody = await response.text()

  if (!rawBody) {
    return null
  }

  try {
    return JSON.parse(rawBody)
  } catch {
    return null
  }
}

function getErrorMessageFromBody(body, fallbackMessage) {
  if (!body || typeof body !== 'object') {
    return fallbackMessage
  }

  if (typeof body.error === 'string' && body.error.trim()) {
    return body.error
  }

  if (typeof body.message === 'string' && body.message.trim()) {
    return body.message
  }

  return fallbackMessage
}

async function requestJson(url, options, fallbackMessage) {
  let response

  try {
    response = await fetch(url, options)
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE)
  }

  const result = await parseResponseBody(response)

  if (!response.ok) {
    throw new Error(getErrorMessageFromBody(result, fallbackMessage))
  }

  if (result === null) {
    throw new Error(INVALID_RESPONSE_MESSAGE)
  }

  return result
}

export async function analyzeErrorMessage(payload) {
  const result = await requestJson(
    buildApiUrl('/analyze'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
    'Analiz isteği başarısız oldu.',
  )

  return result.data
}
