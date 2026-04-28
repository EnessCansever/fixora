import { useEffect, useState } from 'react'
import { Bars3Icon, MoonIcon, SunIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const privateLinks = [
  { to: '/analyze', label: 'Analiz' },
  { to: '/history', label: 'Geçmiş' },
]

const THEME_KEY = 'fixora-theme'

function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    const nextIsDark = !root.classList.contains('dark')

    root.classList.toggle('dark', nextIsDark)
    root.style.colorScheme = nextIsDark ? 'dark' : 'light'
    localStorage.setItem(THEME_KEY, nextIsDark ? 'dark' : 'light')
    setIsDarkMode(nextIsDark)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const links = isAuthenticated ? privateLinks : []

  const handleLogout = () => {
    logout()
    closeMobileMenu()
    navigate('/login', { replace: true })
  }

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <nav className="mx-auto w-full max-w-6xl px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <NavLink to="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">Fixora</h1>
            </NavLink>
            <p className="text-xs text-slate-500 dark:text-slate-400">AI destekli hata analizi</p>
          </div>

        <div className="hidden items-center gap-2 md:flex">
          {!isAuthenticated && (
            <>
              <NavLink
                to="/login"
                className="inline-flex min-h-10 items-center rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-[#6366F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
              >
                Giriş Yap
              </NavLink>
              <NavLink
                to="/register"
                className="inline-flex min-h-10 items-center rounded-md bg-[#6366F1] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#4f46e5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35"
              >
                Kayıt Ol
              </NavLink>
            </>
          )}

          {isAuthenticated && (
            <div className="mr-1 max-w-48 truncate rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {user?.name || user?.email || 'Kullanıcı'}
            </div>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isDarkMode ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
            {isDarkMode ? 'Açık mod' : 'Koyu mod'}
          </button>

          <ul className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `inline-flex min-h-10 items-center rounded-md px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 ${
                    isActive
                      ? 'bg-[#6366F1] text-white'
                      : 'text-slate-700 hover:bg-indigo-50 hover:text-[#6366F1] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          </ul>

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-10 items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-red-500/10 dark:hover:text-red-300"
            >
              Çıkış Yap
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Temayı değiştir"
          >
            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-expanded={isMobileMenuOpen}
            aria-label="Mobil menü"
          >
            {isMobileMenuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>
        </div>

        {isMobileMenuOpen && (
          <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900 md:hidden">
            {isAuthenticated && (
              <div className="max-w-full truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {user?.name || user?.email || 'Kullanıcı'}
              </div>
            )}

            {!isAuthenticated && (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-[#6366F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
                >
                  Giriş Yap
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex min-h-11 items-center rounded-lg bg-[#6366F1] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#4f46e5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35"
                >
                  Kayıt Ol
                </NavLink>
              </>
            )}

            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 ${
                    isActive
                      ? 'bg-[#6366F1] text-white'
                      : 'text-slate-700 hover:bg-indigo-50 hover:text-[#6366F1] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-11 w-full items-center rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/50 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-300"
              >
                Çıkış Yap
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
