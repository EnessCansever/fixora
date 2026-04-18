import { buildApiUrl } from './apiConfig'
import { getAuthHeaders, requestJson } from './authApi'

export async function analyzeErrorMessage(payload) {
  const result = await requestJson(
    buildApiUrl('/analyze'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    },
    'Analiz isteği başarısız oldu.',
    {
      authErrorMessage: 'Oturumunuzun süresi doldu. Analiz için tekrar giriş yapın.',
      emitUnauthorizedEvent: true,
    },
  )

  return result.data
}
