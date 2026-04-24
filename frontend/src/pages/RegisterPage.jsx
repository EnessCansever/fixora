import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { usePageMeta } from '../hooks/usePageMeta'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  usePageMeta({
    title: 'Kayıt Ol | Fixora',
    robots: 'noindex, follow',
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password) {
      setError('Ad, e-posta ve şifre alanları zorunludur.')
      return
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.')
      return
    }

    setIsLoading(true)

    try {
      await register(name, email, password)
      toast.success('Başarıyla kayıt oldunuz.')
      navigate('/analyze')
    } catch (err) {
      const message = err?.message || 'Kayıt işlemi sırasında bir hata oluştu.'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#6366F1]/10 blur-3xl dark:bg-[#6366F1]/15" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-500/10" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-[0_20px_60px_rgba(2,6,23,0.45)] sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800/80">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6366F1]">
                Fixora
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                AI destekli hata analiz deneyimi
              </p>
            </div>

            <Link
              to="/"
              className="text-sm font-medium text-[#6366F1] transition hover:text-[#4f46e5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/40"
            >
              Ana Sayfaya Dön
            </Link>
          </div>

          <div className="mt-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Hesap oluştur
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Fixora’da analiz geçmişini saklamak ve kişisel kullanım deneyimini başlatmak için yeni hesabını oluştur.
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Zaten hesabınız varsa{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="cursor-pointer font-medium text-[#6366F1] transition hover:text-[#4f46e5]"
              >
                giriş yapın
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                Ad
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 shadow-sm transition focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-400"
                placeholder="Adınız"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                E-Posta
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 shadow-sm transition focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-400"
                placeholder="ornek@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                Şifre
              </label>

              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-slate-900 placeholder-slate-500 shadow-sm transition focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-400"
                  placeholder="••••••••"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 my-auto h-fit cursor-pointer text-sm font-medium text-slate-500 transition hover:text-[#6366F1] dark:text-slate-400 dark:hover:text-[#818cf8]"
                >
                  {showPassword ? 'Gizle' : 'Göster'}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                En az 6 karakter
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#6366F1] px-4 py-3 font-medium text-white shadow-sm transition hover:bg-[#4f46e5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/60 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Hesabın oluşturuluyor...' : 'Kayıt Ol'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}