const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export async function getHistoryList() {
  const response = await fetch(`${API_BASE_URL}/api/history`)
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Gecmis kayitlari alinamadi.')
  }

  return result.data
}

export async function getHistoryDetail(id) {
  const response = await fetch(`${API_BASE_URL}/api/history/${id}`)
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Kayit detayi alinamadi.')
  }

  return result.data
}

export async function deleteHistory(id) {
  const response = await fetch(`${API_BASE_URL}/api/history/${id}`, {
    method: 'DELETE',
  })
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Kayit silinemedi.')
  }

  return result.data
}
