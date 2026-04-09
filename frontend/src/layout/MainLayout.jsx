import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
