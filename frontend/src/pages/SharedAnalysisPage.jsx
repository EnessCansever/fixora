import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPublicSharedHistory } from '../services/historyApi'

const categoryLabels = {
  'Type Error': 'Tip Hatası',
  'Reference Error': 'Referans Hatası',
  'Syntax Error': 'Sözdizimi Hatası',
  'React Error': 'React Hatası',
  'API / Network Error': 'API / Ağ Hatası',
  'Build Tool Error': 'Build Aracı Hatası',
  Unknown: 'Bilinmeyen',
}

function getCategoryLabel(category) {
  return categoryLabels[category] || category
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleString('tr-TR')
  } catch {
    return value
  }
}

function normalizeText(value) {
  return String(value || '').trim()
}

function toTextList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeText(item)).filter(Boolean)
  }

  const text = normalizeText(value)
  return text ? [text] : []
}

function SharedAnalysisPage() {
  const { slug } = useParams()
  const [analysis, setAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorText, setErrorText] = useState('')

  const categoryLabel = analysis?.category ? getCategoryLabel(analysis.category) : ''
  const summaryText = normalizeText(analysis?.shortSummary)
  const pageHeading = analysis
    ? summaryText
      ? `${categoryLabel}: ${summaryText}`
      : `${categoryLabel}: Paylaşılan analiz`
    : 'Fixora Analiz Sonucu'

  const explanationText =
    normalizeText(analysis?.turkishExplanation) ||
    'Bu hata, uygulamanın beklediği veri veya çalışma koşulu sağlanmadığında ortaya çıkabilir.'

  const possibleCauses = toTextList(analysis?.possibleCauses)
  const solutionSteps = toTextList(analysis?.solutionSteps)
  const fallbackGuideText =
    'Önce hata mesajındaki değişkeni, veri tipini ve ilgili satırdaki fonksiyon kullanımını kontrol edin.'

  const exampleFixCode = normalizeText(analysis?.exampleFixCode)
  const notesText = normalizeText(analysis?.notes)

  useEffect(() => {
    let cancelled = false

    async function fetchSharedAnalysis() {
      const normalizedSlug = String(slug || '').trim()

      if (!normalizedSlug) {
        setErrorText('Paylaşım bağlantısı geçersiz.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorText('')

      try {
        const data = await getPublicSharedHistory(normalizedSlug)

        if (cancelled) {
          return
        }

        setAnalysis(data)
      } catch (error) {
        if (cancelled) {
          return
        }

        setAnalysis(null)
        setErrorText(error?.message || 'Paylaşılan analiz alınamadı.')
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchSharedAnalysis()

    return () => {
      cancelled = true
    }
  }, [slug])

  return (
    <section className="mx-auto w-full max-w-3xl space-y-5 sm:space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6366F1]">Paylaşılan Analiz</p>
        <h1 className="text-2xl font-bold break-words text-slate-900 sm:text-3xl dark:text-slate-100">{pageHeading}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Bu sayfa, paylaşıma açılmış tek bir analiz kaydını gösterir.</p>
      </header>

      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Paylaşılan analiz yükleniyor...
        </div>
      )}

      {!isLoading && errorText && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
          <p className="text-sm font-semibold text-red-900 dark:text-red-300">Paylaşılan analiz görüntülenemedi</p>
          <p className="mt-1 text-sm text-red-800 dark:text-red-200">{errorText}</p>
          <Link
            to="/"
            className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#6366F1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4f46e5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      )}

      {!isLoading && !errorText && analysis && (
        <>
          <article className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-4">
              <section className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Kategori</h3>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{categoryLabel}</p>
              </section>

              <section className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Kısa Özet</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{analysis.shortSummary}</p>
              </section>

              <section className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Hata Mesajı</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{analysis.errorMessage}</p>
              </section>

              {analysis.codeSnippet && (
                <section className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Kod Parçası</h3>
                  <pre className="mt-2 max-w-full overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100 dark:bg-slate-950">
                    <code>{analysis.codeSnippet}</code>
                  </pre>
                </section>
              )}

              <section className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Bu hata ne anlama geliyor?</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{explanationText}</p>
              </section>

              <section className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Muhtemel nedenler</h3>
                {possibleCauses.length > 0 ? (
                  <ul className="mt-2 space-y-1.5 list-disc pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {possibleCauses.map((cause, index) => (
                      <li key={`${cause}-${index}`}>{cause}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{fallbackGuideText}</p>
                )}
              </section>

              <section className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Çözüm için ne yapmalısın?</h3>
                {solutionSteps.length > 0 ? (
                  <ol className="mt-2 space-y-1.5 list-decimal pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {solutionSteps.map((step, index) => (
                      <li key={`${step}-${index}`}>{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{fallbackGuideText}</p>
                )}

                {exampleFixCode && (
                  <div className="mt-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <pre className="max-w-full overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100 dark:bg-slate-950">
                      <code>{exampleFixCode}</code>
                    </pre>
                  </div>
                )}
              </section>

              {notesText && (
                <section className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Dikkat edilmesi gerekenler</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{notesText}</p>
                </section>
              )}

              <section className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Paylaşım Tarihi</h3>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{formatDate(analysis.createdAt)}</p>
              </section>
            </div>
          </article>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Sonraki Adım</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link
                to="/analyze"
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#6366F1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4f46e5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35"
              >
                Kendi hatanı analiz et
              </Link>
              <Link
                to="/"
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
              >
                Fixora ana sayfasına dön
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default SharedAnalysisPage
