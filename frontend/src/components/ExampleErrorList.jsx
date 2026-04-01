const EXAMPLE_ERRORS = [
  "Cannot read properties of undefined (reading 'map')",
  'Unexpected token }',
  'user.getName is not a function',
  'React Hook was called conditionally',
  'Failed to fetch',
]

function ExampleErrorList({ onSelect }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900">Ornek Hata Mesajlari</h3>
      <p className="mt-1 text-sm text-slate-600">
        Test etmek icin asagidaki orneklerden birine tiklayabilirsin.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLE_ERRORS.map((message) => (
          <button
            key={message}
            type="button"
            onClick={() => onSelect(message)}
            className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs text-slate-700 transition hover:bg-slate-100"
          >
            {message}
          </button>
        ))}
      </div>
    </section>
  )
}

export default ExampleErrorList
