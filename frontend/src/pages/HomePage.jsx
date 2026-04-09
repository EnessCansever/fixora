function HomePage() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6366F1]">
          Fixora
        </p>
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 md:text-6xl">
          Konsol hatalarini daha hizli anlamlandir
        </h1>
        <p className="max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
          Bu proje, tarayici konsolunda gordugun Ingilizce hata mesajlarini daha anlasilir bir Turkceyle aciklamak icin gelistirildi. Basit bir analiz akisi, net sonuc ekranlari ve MongoDB gecmisi ile sunumluk ama sade bir deneyim hedefler.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">Analiz</p>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Hata mesaji ve opsiyonel kod parcasi ile Gemini tabanli aciklama al.
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">Gecmis</p>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Basarili analizleri kaydet ve daha sonra tekrar incele.
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">Sunum</p>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Junior seviyede kalip, gercek problem cozen bir portfolio ornegi olarak kullan.
          </p>
        </article>
      </div>
    </section>
  )
}

export default HomePage
