import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const AUTH_NOTICE_KEY = 'fixora_auth_notice'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const notice = sessionStorage.getItem(AUTH_NOTICE_KEY)

    if (!notice) {
      return
    }

    setError(notice)
    toast.error(notice)
    sessionStorage.removeItem(AUTH_NOTICE_KEY)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('E-posta ve şifre alanları zorunludur.')
      return
    }

    setIsLoading(true)
    try {
      await login(email, password)
      toast.success('Başarıyla giriş yaptınız.')
      navigate('/analyze')
    } catch (err) {
      const message = err?.message || 'Giriş işlemi sırasında bir hata oluştu.'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Giriş Yap</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Hesabınız yoksa{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-[#6366F1] hover:text-[#4f46e5]"
            >
              kayıt olun
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-slate-100">
              E-Posta
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-[#6366F1] focus:outline-none focus:ring-1 focus:ring-[#6366F1] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400"
              placeholder="ornek@email.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-900 dark:text-slate-100">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-[#6366F1] focus:outline-none focus:ring-1 focus:ring-[#6366F1] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#6366F1] px-4 py-2 font-medium text-white transition hover:bg-[#4f46e5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  )
}
