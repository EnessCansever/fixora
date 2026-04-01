function AnalyzeResultCard({ result }) {
  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kategori</p>
        <p className="mt-1 inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-800">
          {result.category}
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-900">Kisa Ozet</h3>
        <p className="mt-1 text-sm text-slate-700">{result.shortSummary}</p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-900">Turkce Aciklama</h3>
        <p className="mt-1 text-sm text-slate-700">{result.turkishExplanation}</p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-900">Muhtemel Nedenler</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {result.possibleCauses?.map((cause) => (
            <li key={cause}>{cause}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-900">Cozum Adimlari</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
          {result.solutionSteps?.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-900">Ornek Duzeltilmis Kod</h3>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
          <code>{result.exampleFixCode}</code>
        </pre>
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-900">Dikkat Edilmesi Gerekenler</h3>
        <p className="mt-1 text-sm text-slate-700">{result.notes}</p>
      </div>
    </section>
  )
}

export default AnalyzeResultCard
