import { useState } from 'react'
import AnalyzeResultCard from '../components/AnalyzeResultCard'
import ExampleErrorList from '../components/ExampleErrorList'
import { analyzeErrorMessage } from '../services/analyzeApi'

function AnalyzeLoadingSkeleton() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="animate-pulse space-y-4">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-6 w-44 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-72 max-w-full rounded bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
          <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-[92%] rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-[78%] rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
          <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-[86%] rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    </section>
  )
}

function AnalyzePage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [codeSnippet, setCodeSnippet] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorText('')
    setAnalysisResult(null)

    const trimmedErrorMessage = errorMessage.trim()
    const trimmedCodeSnippet = codeSnippet.trim()

    if (!trimmedErrorMessage) {
      setErrorText('Lutfen once bir hata mesaji girin.')
      return
    }

    setIsLoading(true)

    try {
      const result = await analyzeErrorMessage({
        errorMessage: trimmedErrorMessage,
        codeSnippet: trimmedCodeSnippet || undefined,
      })
      setAnalysisResult(result)
    } catch (error) {
      setErrorText(error?.message || 'Analiz yapilirken bir sorun olustu. Lutfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleSelect = (example) => {
    setErrorMessage(example.errorMessage)
    setCodeSnippet(example.codeSnippet || '')
    setErrorText('')
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6366F1]">
          Analyze
        </p>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Hata Analizi</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Ingilizce hata mesajini gir, istersen ilgili kodu ekle. Sistem bu veriyi backend analiz servisine gonderir ve sonucu Turkce olarak gosterir.
        </p>
      </header>

      <ExampleErrorList onSelect={handleExampleSelect} />

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-1">
          <label htmlFor="errorMessage" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Hata Mesaji <span className="text-red-500">*</span>
          </label>
          <textarea
            id="errorMessage"
            value={errorMessage}
            onChange={(event) => setErrorMessage(event.target.value)}
            className="min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-[#6366F1]/40 focus:bg-white focus:ring-4 focus:ring-[#6366F1]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
            placeholder="Ornek: Cannot read properties of undefined (reading 'map')"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="codeSnippet" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Kod Parcasi <span className="text-slate-400 font-medium">(opsiyonel)</span>
          </label>
          <textarea
            id="codeSnippet"
            value={codeSnippet}
            onChange={(event) => setCodeSnippet(event.target.value)}
            className="min-h-36 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 font-mono text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-[#6366F1]/40 focus:bg-white focus:ring-4 focus:ring-[#6366F1]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
            placeholder="Ornek kodu buraya ekleyebilirsin..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center rounded-lg bg-linear-to-r from-[#6366F1] to-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isLoading ? 'Analiz ediliyor...' : 'Analiz Et'}
        </button>
      </form>

      {isLoading && (
        <div className="space-y-3">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/10">
            <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">Hata analiz ediliyor...</p>
            <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">Kod inceleniyor, cozum onerileri hazirlaniyor.</p>
          </div>
          <AnalyzeLoadingSkeleton />
        </div>
      )}

      {!isLoading && errorText && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
          <p className="text-sm font-semibold text-red-900 dark:text-red-300">Analiz su anda olusturulamadi</p>
          <p className="mt-1 text-sm text-red-800 dark:text-red-200">{errorText}</p>
        </div>
      )}

      {!isLoading && !errorText && !analysisResult && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Analiz sonucu burada gosterilecek</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Baslamak icin once hata mesaji gir. Istersen kod parcasini da ekleyip "Analiz Et" butonuna basabilirsin.
          </p>
        </div>
      )}

      {!isLoading && !errorText && analysisResult && (
        <AnalyzeResultCard result={analysisResult} />
      )}
    </section>
  )
}


export default AnalyzePage
