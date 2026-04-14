import { Link } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const featureCards = [
  {
    title: 'Turkce sade aciklama',
    description: 'Karisik hata metinlerini anlasilir ve net bir dile cevirir.',
  },
  {
    title: 'Muhtemel nedenler',
    description: 'Sorunun olasi kaynaklarini oncelik sirasiyla listeler.',
  },
  {
    title: 'Adim adim cozum',
    description: 'Dogrudan uygulanabilir adimlarla nasil ilerleyecegini gosterir.',
  },
  {
    title: 'Ornek duzeltilmis kod',
    description: 'Uygulanabilir bir kod ornegi ile cozum yolunu somutlastirir.',
  },
]

const howItWorks = [
  {
    title: 'Hatani Yapistir',
    description: 'Konsoldaki Ingilizce hata mesajini ve istersen kodunu ekle.',
  },
  {
    title: 'Aninda Analiz',
    description: 'Fixora hatayi kategorize eder ve baglamiyla birlikte yorumlar.',
  },
  {
    title: 'Cozume Ulas',
    description: 'Muhtemel nedenleri, cozum adimlarini ve ornek kodu incele.',
  },
]

const demoCode = `const names = users.map((user) => user.name)`

function HomePage() {
  return (
    <section className="space-y-10 pb-2 sm:space-y-12 md:space-y-14 md:pb-4">
      <header className="space-y-5 sm:space-y-6">
        <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-[#6366F1] dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
          Fixora • Hata Analizi
        </div>

        <div className="space-y-4">
          <h1 className="max-w-5xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100 md:text-5xl lg:text-6xl">
            Ingilizce hata mesajlarini, uygulanabilir Turkce cozumlere donustur.
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
            Fixora, gordugun hatanin ne anlama geldigini saniyeler icinde aciklar. Muhtemel nedenleri,
            adim adim cozum onerisini ve ornek duzeltilmis kodu tek ekranda sunar.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            to="/analyze"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-linear-to-r from-[#6366F1] to-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35"
          >
            Hemen Analiz Et
          </Link>
          <Link
            to="/history"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#6366F1]/35 hover:text-[#6366F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-400/40 dark:hover:text-indigo-300"
          >
            Gecmisi Goruntule
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">Gelistiriciler icin uretildi</span>
          <span className="rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">Acik kaynak yaklasimiyla gelistiriliyor</span>
        </div>
      </header>

      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nasil Calisir?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.map((item, index) => (
            <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-[#6366F1] dark:bg-indigo-500/20 dark:text-indigo-300">
                {index + 1}
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">One Cikan Ozellikler</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {featureCards.map((feature) => (
            <article key={feature.title} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mini Demo</h2>
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Input</p>
            <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Ornek Hata Mesaji</h3>
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm wrap-break-word text-slate-700 sm:p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              Uncaught TypeError: Cannot read properties of undefined (reading 'map')
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Probleme Neden Olan Kod</h3>
            <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="min-w-0 dark:hidden">
                <SyntaxHighlighter
                  language="javascript"
                  style={oneLight}
                  customStyle={{ margin: 0, padding: '12px', fontSize: '11px', background: '#f8fafc', minWidth: 'max-content' }}
                  showLineNumbers
                >
                  {demoCode}
                </SyntaxHighlighter>
              </div>
              <div className="hidden min-w-0 dark:block">
                <SyntaxHighlighter
                  language="javascript"
                  style={oneDark}
                  customStyle={{ margin: 0, padding: '12px', fontSize: '11px', background: '#0f172a', minWidth: 'max-content' }}
                  showLineNumbers
                >
                  {demoCode}
                </SyntaxHighlighter>
              </div>
            </div>
          </article>

          <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Fixora Output</p>
            <div className="mt-3 space-y-3">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Kisa Ozet</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  users degiskeni beklenen anda dizi degil veya tanimsiz oldugu icin map cagrisi hata veriyor.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Muhtemel Nedenler</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  <li>• API cevabi beklenenden gec geliyor.</li>
                  <li>• users state ilk renderda undefined olabilir.</li>
                </ul>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Cozum</p>
                <ol className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  <li>1. users icin baslangic degeri olarak bos dizi kullan.</li>
                  <li>2. map cagrisi oncesi Array.isArray(users) kontrolu ekle.</li>
                </ol>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-indigo-200 bg-linear-to-r from-indigo-50 to-white p-6 dark:border-indigo-500/30 dark:from-indigo-500/10 dark:to-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-100">Hemen Basla</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Ilk hatani simdi analiz et ve cozum yolunu netlestir.</p>
          </div>
          <Link
            to="/analyze"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#6366F1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5558E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35"
          >
            Hemen Analiz Et
          </Link>
        </div>
      </section>
    </section>
  )
}

export default HomePage
