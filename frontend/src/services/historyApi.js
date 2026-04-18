import { buildApiUrl } from './apiConfig'
import { getAuthHeaders, requestJson } from './authApi'

const HISTORY_AUTH_ERROR_MESSAGE = 'Oturumunuzun süresi doldu. Geçmişe erişmek için tekrar giriş yapın.'

export async function getHistoryList() {
  const result = await requestJson(
    buildApiUrl('/history'),
    {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    },
    'Geçmiş kayıtları alınamadı.',
    {
      authErrorMessage: HISTORY_AUTH_ERROR_MESSAGE,
      emitUnauthorizedEvent: true,
    },
  )

  return result.data
}

export async function getHistoryDetail(id) {
  const result = await requestJson(
    buildApiUrl(`/history/${id}`),
    {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    },
    'Kayıt detayı alınamadı.',
    {
      authErrorMessage: HISTORY_AUTH_ERROR_MESSAGE,
      emitUnauthorizedEvent: true,
    },
  )

  return result.data
}

export async function deleteHistory(id) {
  const result = await requestJson(
    buildApiUrl(`/history/${id}`),
    {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    },
    'Kayıt silinemedi.',
    {
      authErrorMessage: HISTORY_AUTH_ERROR_MESSAGE,
      emitUnauthorizedEvent: true,
    },
  )

  return result.data
}

export async function sendHistoryFeedback(id, feedbackType) {
  const result = await requestJson(
    buildApiUrl(`/history/${id}/feedback`),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ feedbackType }),
    },
    'Geri bildirim gönderilemedi.',
    {
      authErrorMessage: HISTORY_AUTH_ERROR_MESSAGE,
      emitUnauthorizedEvent: true,
    },
  )

  return result.data
}
