import { useState } from 'react'
import AnalyzeResultCard from '../components/AnalyzeResultCard'
import ExampleErrorList from '../components/ExampleErrorList'
import { analyzeErrorMessage } from '../services/analyzeApi'

function AnalyzePage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [codeSnippet, setCodeSnippet] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorText('')

    if (!errorMessage.trim()) {
      setErrorText('Lutfen hata mesaji alanini bos birakmayin.')
      return
    }

    setIsLoading(true)

    try {
      const result = await analyzeErrorMessage({
        errorMessage: errorMessage.trim(),
        codeSnippet: codeSnippet.trim() || undefined,
      })
      setAnalysisResult(result)
    } catch (error) {
      setAnalysisResult(null)
      setErrorText(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleSelect = (exampleMessage) => {
    setErrorMessage(exampleMessage)
    setErrorText('')
  }

  return (
    <section className="space-y-5">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Hata Analizi</h2>
        <p className="max-w-2xl text-sm text-slate-600">
          Ingilizce hata mesajini gir, istersen ilgili kodu ekle. Sistem backend mock endpointine istek atip sonucu Turkce aciklama ile gosterecek.
        </p>
      </header>

      <ExampleErrorList onSelect={handleExampleSelect} />

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <div className="space-y-1">
          <label htmlFor="errorMessage" className="text-sm font-semibold text-slate-900">
            Hata Mesaji
          </label>
          <textarea
            id="errorMessage"
            value={errorMessage}
            onChange={(event) => setErrorMessage(event.target.value)}
            className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-200 transition focus:ring"
            placeholder="Ornek: Cannot read properties of undefined (reading 'map')"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="codeSnippet" className="text-sm font-semibold text-slate-900">
            Kod Parcasi (Opsiyonel)
          </label>
          <textarea
            id="codeSnippet"
            value={codeSnippet}
            onChange={(event) => setCodeSnippet(event.target.value)}
            className="min-h-36 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-800 outline-none ring-sky-200 transition focus:ring"
            placeholder="Ornek kodu buraya ekleyebilirsin..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Analiz ediliyor...' : 'Analiz Et'}
        </button>
      </form>

      {isLoading && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
          Analiz hazirlaniyor, lutfen bekleyin...
        </div>
      )}

      {!isLoading && errorText && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {errorText}
        </div>
      )}

      {!isLoading && !errorText && !analysisResult && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
          Henuz analiz sonucu yok. Bir hata mesaji girip "Analiz Et" butonuna bas.
        </div>
      )}

      {!isLoading && !errorText && analysisResult && (
        <AnalyzeResultCard result={analysisResult} />
      )}
    </section>
  )
}


export default AnalyzePage
