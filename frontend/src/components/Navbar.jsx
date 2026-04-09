import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Ana Sayfa' },
  { to: '/analyze', label: 'Analiz' },
  { to: '/history', label: 'Gecmis' },
]

const THEME_KEY = 'fixora-theme'

function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false)

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

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Fixora</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Simple error analysis demo</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isDarkMode ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
            {isDarkMode ? 'Light' : 'Dark'}
          </button>

          <ul className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/35 ${
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
        </div>
      </nav>
    </header>
  )
}

export default Navbar
