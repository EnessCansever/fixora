import { buildApiUrl } from './apiConfig'

const NETWORK_ERROR_MESSAGE = 'Sunucuya ulaşılamadı. İnternet bağlantınızı veya ağ erişimini kontrol edin.'
const INVALID_RESPONSE_MESSAGE = 'Sunucudan geçersiz bir yanıt alındı.'
const UNAUTHORIZED_EVENT_NAME = 'fixora:unauthorized'

export const AUTH_TOKEN_KEY = 'fixora_auth_token'
export const SESSION_EXPIRED_MESSAGE = 'Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.'

class ApiError extends Error {
  constructor(message, { status, isAuthError = false } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.isAuthError = isAuthError
  }
}

function emitUnauthorized(message) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent(UNAUTHORIZED_EVENT_NAME, {
      detail: {
        message,
      },
    }),
  )
}

export function subscribeUnauthorized(handler) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const listener = (event) => {
    handler(event?.detail?.message)
  }

  window.addEventListener(UNAUTHORIZED_EVENT_NAME, listener)

  return () => {
    window.removeEventListener(UNAUTHORIZED_EVENT_NAME, listener)
  }
}

export function getAuthHeaders() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

export function isAuthError(error) {
  return error instanceof ApiError && error.isAuthError === true
}

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

export async function requestJson(url, options, fallbackMessage, config = {}) {
  let response

  const {
    authErrorMessage = SESSION_EXPIRED_MESSAGE,
    emitUnauthorizedEvent = false,
    treat401AsAuthError = emitUnauthorizedEvent,
  } = config

  try {
    response = await fetch(url, options)
  } catch {
    throw new ApiError(NETWORK_ERROR_MESSAGE)
  }

  const result = await parseResponseBody(response)

  if (!response.ok) {
    const status = response.status

    if (status === 401 && treat401AsAuthError) {
      const unauthorizedMessage = authErrorMessage || SESSION_EXPIRED_MESSAGE

      if (emitUnauthorizedEvent) {
        emitUnauthorized(unauthorizedMessage)
      }

      throw new ApiError(unauthorizedMessage, {
        status,
        isAuthError: true,
      })
    }

    throw new ApiError(getErrorMessageFromBody(result, fallbackMessage), {
      status,
    })
  }

  if (result === null) {
    throw new ApiError(INVALID_RESPONSE_MESSAGE)
  }

  return result
}

export async function registerUser(name, email, password) {
  const result = await requestJson(
    buildApiUrl('/auth/register'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    },
    'Kayıt işlemi sırasında bir hata oluştu.',
  )

  return result.data
}

export async function loginUser(email, password) {
  const result = await requestJson(
    buildApiUrl('/auth/login'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    },
    'Giriş işlemi sırasında bir hata oluştu.',
  )

  return result.data
}

export async function getCurrentUser(token) {
  const result = await requestJson(
    buildApiUrl('/auth/me'),
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    },
    'Kullanıcı bilgisi alınamadı.',
    {
      authErrorMessage: SESSION_EXPIRED_MESSAGE,
      emitUnauthorizedEvent: true,
    },
  )

  return result.data
}
