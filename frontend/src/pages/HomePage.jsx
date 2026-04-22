import { Link } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const featureCards = [
  {
    title: 'Sadece çeviri değil, analiz',
    description: 'Hata mesajını bağlamıyla yorumlar; yalnızca kelime çevirisi sunmaz.',
  },
  {
    title: 'Kısa ve net özet',
    description: 'Sorunun ne olduğunu teknik ama sade bir dille hızlıca anlatır.',
  },
  {
    title: 'Muhtemel nedenler',
    description: 'Problemin olası kaynaklarını önceliklendirilmiş şekilde listeler.',
  },
  {
    title: 'Adım adım çözüm',
    description: 'Deneyebileceğin aksiyonları sıralı ve uygulanabilir biçimde verir.',
  },
  {
    title: 'Örnek fix kodu',
    description: 'Çözümü somutlaştıran örnek kodla deneme süresini kısaltır.',
  },
  {
    title: 'Geçmiş ve paylaşım',
    description: 'Analizleri kaydeder, bağlantı ile takımınla paylaşmanı kolaylaştırır.',
  },
]

const howItWorks = [
  {
    title: '1) Hatanı yapıştır',
    description: 'Konsoldaki İngilizce hata mesajını ve istersen ilgili kodu ekle.',
  },
  {
    title: '2) Analizi al',
    description: 'Fixora hatayı kategorize eder; özet, nedenler ve çözüm adımlarını çıkarır.',
  },
  {
    title: '3) Çözümü uygula',
    description: 'Önerilen adımları ve örnek fix kodunu kullanarak sorunu daha hızlı kapat.',
  },
]

const demoCode = `const names = users.map((user) => user.name)`

function HomePage() {
  return (
    <section className="space-y-10 pb-2 sm:space-y-12 md:space-y-14 md:pb-4">
      <header className="space-y-5 sm:space-y-6">
        <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-[#6366F1] dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
          Fixora • AI destekli hata analizi
        </div>

        <div className="space-y-4">
          <h1 className="max-w-5xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100 md:text-5xl lg:text-6xl">
            İngilizce hata mesajını dakikalarca çözmeye çalışma. Türkçe, net ve uygulanabilir analiz al.
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
            Fixora, İngilizce console ve browser hatalarını anlaşılır hale getirir; kısa özet, olası
            nedenler, çözüm adımları ve örnek fix kodunu tek ekranda sunar.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            to="/analyze"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-linear-to-r from-[#6366F1] to-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35"
          >
            Hemen Analiz Et
          </Link>
          <a
            href="#ornek-analiz-akisi"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#6366F1]/35 hover:text-[#6366F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-400/40 dark:hover:text-indigo-300"
          >
            Örnek Kullanımı Gör
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            Hesapla güvenli erişim
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            Analiz geçmişi
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            Paylaşılabilir bağlantı
          </span>
        </div>
      </header>

      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nasıl Çalışır?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.map((item, index) => (
            <article
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Neden Fixora?</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          Fixora, hata mesajını yalnızca Türkçeye çevirmek yerine seni çözüme götürecek bir analiz akışı sunar.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => (
            <article
              key={feature.title}
              className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">Analizlerini kaybetmeden, aynı yerden devam et</h2>
          <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Analizlerini hesabında tutabilir, sonra tekrar açabilir ve ekibinle paylaşabilirsin. Böylece aynı hatayı
            her seferinde sıfırdan açıklamak zorunda kalmazsın.
          </p>
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 px-3 py-3 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Hesabınla giriş yap, analizlerin düzenli kalsın.
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-3 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Geçmiş kayıtlarla benzer hataları daha hızlı çöz.
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-3 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Paylaşım linki ile analizi tek tıkla ekip arkadaşına gönder.
            </div>
          </div>
        </div>
      </section>

      <section id="ornek-analiz-akisi" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Örnek Analiz Akışı</h2>
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Girdi
            </p>
            <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Örnek Hata Mesajı
            </h3>
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5 wrap-break-word text-sm text-slate-700 sm:p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              Uncaught TypeError: Cannot read properties of undefined (reading 'map')
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Soruna Neden Olan Kod
            </h3>
            <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="min-w-0 dark:hidden">
                <SyntaxHighlighter
                  language="javascript"
                  style={oneLight}
                  customStyle={{
                    margin: 0,
                    padding: '12px',
                    fontSize: '11px',
                    background: '#f8fafc',
                    minWidth: 'max-content',
                  }}
                  showLineNumbers
                >
                  {demoCode}
                </SyntaxHighlighter>
              </div>
              <div className="hidden min-w-0 dark:block">
                <SyntaxHighlighter
                  language="javascript"
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    padding: '12px',
                    fontSize: '11px',
                    background: '#0f172a',
                    minWidth: 'max-content',
                  }}
                  showLineNumbers
                >
                  {demoCode}
                </SyntaxHighlighter>
              </div>
            </div>
          </article>

          <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Fixora Çıktısı</p>
            <div className="mt-3 space-y-3">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Kısa Özet
                </p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  users değişkeni beklenen anda dizi değil veya tanımsız olduğu için map çağrısı hata veriyor.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Muhtemel Nedenler
                </p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  <li>• API cevabı beklenenden geç geliyor.</li>
                  <li>• users state ilk render’da undefined olabilir.</li>
                </ul>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Çözüm
                </p>
                <ol className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  <li>1. users için başlangıç değeri olarak boş dizi kullan.</li>
                  <li>2. map çağrısı öncesi Array.isArray(users) kontrolü ekle.</li>
                </ol>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-indigo-200 bg-linear-to-r from-indigo-50 to-white p-6 dark:border-indigo-500/30 dark:from-indigo-500/10 dark:to-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-100">İlk hatanı şimdi analiz et</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Kopyala, yapıştır, çözüm adımlarını al. Fixora ile hata çözüm sürecini daha öngörülebilir hale getir.
            </p>
          </div>
          <Link
            to="/analyze"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#6366F1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5558E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35"
          >
            Fixora'yı Dene
          </Link>
        </div>
      </section>
    </section>
  )
}

export default HomePage