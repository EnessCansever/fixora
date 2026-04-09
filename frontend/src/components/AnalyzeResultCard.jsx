import { useState } from 'react'
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const badgeByCategory = {
  'Type Error': 'bg-amber-100 text-amber-800',
  'Reference Error': 'bg-blue-100 text-blue-800',
  'Syntax Error': 'bg-rose-100 text-rose-800',
  'React Error': 'bg-cyan-100 text-cyan-800',
  'API / Network Error': 'bg-violet-100 text-violet-800',
  'Build Tool Error': 'bg-indigo-100 text-indigo-800',
  Unknown: 'bg-slate-100 text-slate-700',
}

function AnalyzeResultCard({ result }) {
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    if (!result.exampleFixCode) {
      return
    }

    try {
      await navigator.clipboard.writeText(result.exampleFixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      setCopied(false)
    }
  }

  const badgeClass = badgeByCategory[result.category] || badgeByCategory.Unknown

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
      <header className="mb-5 border-b border-slate-200 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6366F1]">
          Result
        </p>
        <h3 className="mt-1 text-xl font-bold text-slate-900">Analiz Sonucu</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Hata mesaji icin uretilen aciklama ve cozum onerileri.
        </p>
      </header>

      <div className="space-y-5">
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kategori</p>
          <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
            {result.category}
          </span>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-5">
          <div className="rounded-xl bg-slate-50 px-4 py-4">
            <h3 className="text-base font-semibold text-slate-900">Kisa Ozet</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{result.shortSummary}</p>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-4">
            <h3 className="text-base font-semibold text-slate-900">Turkce Aciklama</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{result.turkishExplanation}</p>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-4">
            <h3 className="text-base font-semibold text-slate-900">Muhtemel Nedenler</h3>
            <ul className="mt-3 space-y-2">
              {result.possibleCauses?.map((cause) => (
                <li key={cause} className="flex items-start gap-2 text-sm text-slate-700">
                  <InformationCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-4">
            <h3 className="text-base font-semibold text-slate-900">Cozum Adimlari</h3>
            <ol className="mt-3 space-y-2">
              {result.solutionSteps?.map((step, index) => (
                <li key={step} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#6366F1]" />
                  <span>
                    <span className="mr-1 font-medium text-slate-800">{index + 1}.</span>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-4">
            <h3 className="text-base font-semibold text-slate-900">Ornek Duzeltilmis Kod</h3>
            {result.exampleFixCode ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-3 py-2">
                  <span className="text-xs font-medium text-slate-600">example.js</span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="rounded border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs font-semibold text-[#6366F1] hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35"
                  >
                    {copied ? 'Kopyalandi' : 'Kopyala'}
                  </button>
                </div>
                <SyntaxHighlighter
                  language="javascript"
                  style={oneLight}
                  customStyle={{ margin: 0, padding: '16px', fontSize: '12px', background: '#ffffff' }}
                  showLineNumbers
                >
                  {result.exampleFixCode}
                </SyntaxHighlighter>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Bu hata icin ornek kod bulunmuyor.</p>
            )}
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-4">
            <h3 className="text-base font-semibold text-slate-900">Dikkat Edilmesi Gerekenler</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{result.notes}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnalyzeResultCard
