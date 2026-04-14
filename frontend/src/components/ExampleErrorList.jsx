const EXAMPLE_ERRORS = [
  {
    title: 'Tip Hatası - map',
    errorMessage: "Cannot read properties of undefined (reading 'map')",
    codeSnippet: "const items = data.items\nconst names = items.map((item) => item.name)",
  },
  {
    title: 'Tip Hatası - fonksiyon',
    errorMessage: 'items.filter is not a function',
    codeSnippet: "const items = 'hello'\nconst result = items.filter(Boolean)",
  },
  {
    title: 'Referans Hatası',
    errorMessage: 'myVar is not defined',
    codeSnippet: 'console.log(myVar)',
  },
  {
    title: 'React hydration hatası',
    errorMessage: 'Hydration failed because the initial UI does not match what was rendered on the server',
    codeSnippet: '<div>{new Date().toLocaleString()}</div>',
  },
  {
    title: 'Ağ Hatası',
    errorMessage: 'Failed to fetch',
    codeSnippet: "fetch('/api/users').then((res) => res.json())",
  },
]

function ExampleErrorList({ onSelect }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Hızlı Test Örnekleri</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
        Aşağıdaki örneklerden birine tıklayarak hata mesajı ve kod alanlarını hızlıca doldurabilirsin.
      </p>
      <div className="mt-3 grid gap-2 sm:gap-3 md:grid-cols-2">
        {EXAMPLE_ERRORS.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onSelect(item)}
            className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-[#6366F1]/35 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/25 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-[#6366F1]/45 dark:hover:bg-slate-700"
          >
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{item.errorMessage}</p>
          </button>
        ))}
      </div>
    </section>
  )
}

export default ExampleErrorList
