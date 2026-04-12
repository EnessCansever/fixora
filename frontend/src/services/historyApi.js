import { buildApiUrl } from './apiConfig'

export async function getHistoryList() {
  const response = await fetch(buildApiUrl('/history'))
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Gecmis kayitlari alinamadi.')
  }

  return result.data
}

export async function getHistoryDetail(id) {
  const response = await fetch(buildApiUrl(`/history/${id}`))
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Kayit detayi alinamadi.')
  }

  return result.data
}

export async function deleteHistory(id) {
  const response = await fetch(buildApiUrl(`/history/${id}`), {
    method: 'DELETE',
  })
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Kayit silinemedi.')
  }

  return result.data
}

export async function sendHistoryFeedback(id, feedbackType) {
  const response = await fetch(buildApiUrl(`/history/${id}/feedback`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ feedbackType }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Geri bildirim gonderilemedi.')
  }

  return result.data
}
