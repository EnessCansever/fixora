import { useState } from 'react'
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { sendHistoryFeedback } from '../services/historyApi'

const badgeByCategory = {
  'Type Error': 'bg-amber-100 text-amber-800',
  'Reference Error': 'bg-blue-100 text-blue-800',
  'Syntax Error': 'bg-rose-100 text-rose-800',
  'React Error': 'bg-cyan-100 text-cyan-800',
  'API / Network Error': 'bg-violet-100 text-violet-800',
  'Build Tool Error': 'bg-indigo-100 text-indigo-800',
  Unknown: 'bg-slate-100 text-slate-700',
}

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

function AnalyzeResultCard({ result }) {
  const [copied, setCopied] = useState(false)
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)

  const copyCode = async () => {
    if (!result.exampleFixCode) {
      toast.error('Kopyalanacak kod bulunmuyor.')
      return
    }

    try {
      await navigator.clipboard.writeText(result.exampleFixCode)
      setCopied(true)
      toast.success('Kod panoya kopyalandı.')
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      setCopied(false)
      toast.error('Kod kopyalanamadı.')
    }
  }

  const badgeClass = badgeByCategory[result.category] || badgeByCategory.Unknown

  const handleFeedback = async (feedbackType) => {
    if (!result.historyId) {
      toast.error('Geri bildirim gönderilemedi. Lütfen tekrar deneyin.')
      return
    }

    setIsSendingFeedback(true)

    try {
      await sendHistoryFeedback(result.historyId, feedbackType)

      if (feedbackType === 'positive') {
        toast.success('Geri bildiriminiz için teşekkürler.')
      } else {
        toast.success('Teşekkürler. Bunu geliştirmek için not aldık.')
      }
    } catch (error) {
      toast.error('Geri bildirim gönderilemedi. Lütfen tekrar deneyin.')
    } finally {
      setIsSendingFeedback(false)
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6 dark:border-slate-800 dark:bg-slate-900">
      <header className="mb-5 border-b border-slate-200 pb-4 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6366F1]">
          Sonuç
        </p>
        <h3 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100">Analiz Sonucu</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Hata mesajı için üretilen açıklama ve çözüm önerileri.
        </p>
      </header>

      <div className="space-y-5">
        <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Kategori</p>
          <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
            {getCategoryLabel(result.category)}
          </span>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
          <div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Kısa Özet</h3>
            <p className="mt-2 wrap-break-word text-sm leading-6 text-slate-700 dark:text-slate-300">{result.shortSummary}</p>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Türkçe Açıklama</h3>
            <p className="mt-2 wrap-break-word text-sm leading-6 text-slate-700 dark:text-slate-300">{result.turkishExplanation}</p>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Muhtemel Nedenler</h3>
            <ul className="mt-3 space-y-2">
              {result.possibleCauses?.map((cause) => (
                <li key={cause} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <InformationCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="wrap-break-word">{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Çözüm Adımları</h3>
            <ol className="mt-3 space-y-2">
              {result.solutionSteps?.map((step, index) => (
                <li key={step} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#6366F1]" />
                  <span className="wrap-break-word">
                    <span className="mr-1 font-medium text-slate-800 dark:text-slate-200">{index + 1}.</span>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Örnek Düzeltilmiş Kod</h3>
            {result.exampleFixCode ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-100 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">example.js</span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex min-h-9 items-center rounded border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-[#6366F1] hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-300 dark:hover:bg-indigo-500/25"
                  >
                    {copied ? 'Kopyalandı' : 'Kopyala'}
                  </button>
                </div>
                <div className="overflow-x-auto dark:hidden">
                  <SyntaxHighlighter
                    language="javascript"
                    style={oneLight}
                    customStyle={{ margin: 0, padding: '16px', fontSize: '12px', background: '#ffffff', minWidth: '320px' }}
                    showLineNumbers
                  >
                    {result.exampleFixCode}
                  </SyntaxHighlighter>
                </div>
                <div className="hidden overflow-x-auto dark:block">
                  <SyntaxHighlighter
                    language="javascript"
                    style={oneDark}
                    customStyle={{ margin: 0, padding: '16px', fontSize: '12px', background: '#0f172a', minWidth: '320px' }}
                    showLineNumbers
                  >
                    {result.exampleFixCode}
                  </SyntaxHighlighter>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Bu hata için örnek kod bulunmuyor.</p>
            )}
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Dikkat Edilmesi Gerekenler</h3>
            <p className="mt-2 wrap-break-word text-sm leading-6 text-slate-700 dark:text-slate-300">{result.notes}</p>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Bu sonuç faydalı oldu mu?</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleFeedback('positive')}
                disabled={isSendingFeedback || !result.historyId}
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                👍
              </button>
              <button
                type="button"
                onClick={() => handleFeedback('negative')}
                disabled={isSendingFeedback || !result.historyId}
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                👎
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnalyzeResultCard
