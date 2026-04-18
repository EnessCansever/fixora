import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AnalyzeResultCard from '../components/AnalyzeResultCard'
import ExampleErrorList from '../components/ExampleErrorList'
import { analyzeErrorMessage } from '../services/analyzeApi'

const LOADING_MESSAGES = [
  'Hata mesajı inceleniyor...',
  'Muhtemel nedenler çıkarılıyor...',
  'Çözüm adımları hazırlanıyor...',
  'Fixora sonucu son kez düzenliyor...',
]

function AnalyzeLoadingSkeleton() {
  return (
    <section className="min-h-120 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 md:min-h-140 md:p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="animate-pulse space-y-5">
        <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
          <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-6 w-28 rounded-full bg-indigo-100 dark:bg-indigo-500/25" />
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
          <div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
            <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-[92%] rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
            <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-[89%] rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
            <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-[84%] rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-[76%] rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
            <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-[91%] rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
              <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-600" />
              <div className="h-6 w-16 rounded bg-indigo-100 dark:bg-indigo-500/25" />
            </div>
            <div className="space-y-2 p-4">
              <div className="h-3 w-[96%] rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-[88%] rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-[80%] rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StagedLoadingMessage({ message, step }) {
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/10">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
        <span className="inline-block h-2 w-2 rounded-full bg-[#6366F1]" />
        Analiz Sürüyor
      </div>
      <p className="mt-2 text-sm font-semibold text-indigo-900 dark:text-indigo-200">{message}</p>
      <p className="mt-1 text-xs text-indigo-700 dark:text-indigo-300">
        Adim {step} / {LOADING_MESSAGES.length}
      </p>
    </div>
  )
}

function AnalyzePage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [codeSnippet, setCodeSnippet] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)

  useEffect(() => {
    if (!isLoading) {
      setLoadingMessageIndex(0)
      return
    }

    const interval = window.setInterval(() => {
      setLoadingMessageIndex((prevIndex) => {
        if (prevIndex >= LOADING_MESSAGES.length - 1) {
          return prevIndex
        }

        return prevIndex + 1
      })
    }, 1200)

    return () => window.clearInterval(interval)
  }, [isLoading])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorText('')
    setAnalysisResult(null)

    const trimmedErrorMessage = errorMessage.trim()
    const trimmedCodeSnippet = codeSnippet.trim()

    if (!trimmedErrorMessage) {
      setErrorText('Lütfen önce bir hata mesajı girin.')
      toast.error('Hata mesajı girin.')
      return
    }

    setIsLoading(true)

    try {
      const result = await analyzeErrorMessage({
        errorMessage: trimmedErrorMessage,
        codeSnippet: trimmedCodeSnippet || undefined,
      })
      setAnalysisResult(result)
      toast.success('Analiz tamamlandı.')
    } catch (error) {
      const message = error?.message || 'Analiz yapılırken bir sorun oluştu. Lütfen tekrar deneyin.'
      setErrorText(message)
      toast.error(message)
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
    <section className="space-y-5 sm:space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6366F1]">
          Analiz
        </p>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">Hata Analizi</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          İngilizce hata mesajını gir, istersen ilgili kodu ekle. Sistem bu veriyi backend analiz servisine gönderir ve sonucu Türkçe olarak gösterir.
        </p>
      </header>

      <ExampleErrorList onSelect={handleExampleSelect} />

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-1">
          <label htmlFor="errorMessage" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Hata Mesajı <span className="text-red-500">*</span>
          </label>
          <textarea
            id="errorMessage"
            value={errorMessage}
            onChange={(event) => setErrorMessage(event.target.value)}
            className="min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-[#6366F1]/40 focus:bg-white focus:ring-4 focus:ring-[#6366F1]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
            placeholder="Örnek: Cannot read properties of undefined (reading 'map')"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="codeSnippet" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Kod Parçası <span className="text-slate-400 font-medium">(isteğe bağlı)</span>
          </label>
          <textarea
            id="codeSnippet"
            value={codeSnippet}
            onChange={(event) => setCodeSnippet(event.target.value)}
            className="min-h-36 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 font-mono text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-[#6366F1]/40 focus:bg-white focus:ring-4 focus:ring-[#6366F1]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
            placeholder="Örnek kodu buraya ekleyebilirsin..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-linear-to-r from-[#6366F1] to-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
        >
          {isLoading ? 'Analiz ediliyor...' : 'Analiz Et'}
        </button>
      </form>

      {isLoading && (
        <div className="space-y-3">
          <StagedLoadingMessage
            message={LOADING_MESSAGES[loadingMessageIndex]}
            step={loadingMessageIndex + 1}
          />
          <AnalyzeLoadingSkeleton />
        </div>
      )}

      {!isLoading && errorText && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
          <p className="text-sm font-semibold text-red-900 dark:text-red-300">Analiz şu anda oluşturulamadı</p>
          <p className="mt-1 text-sm text-red-800 dark:text-red-200">{errorText}</p>
        </div>
      )}

      {!isLoading && !errorText && !analysisResult && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Analiz sonucu burada gösterilecek</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Başlamak için önce hata mesajı gir. İstersen kod parçasını da ekleyip "Analiz Et" butonuna basabilirsin.
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
