import { buildApiUrl } from './apiConfig'

export async function analyzeErrorMessage(payload) {
  const response = await fetch(buildApiUrl('/analyze'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Analiz isteği başarısız oldu.')
  }

  return result.data
}
