import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function MainLayout() {
  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-4 sm:py-6 md:py-8">
        <Outlet />
      </main>
      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          duration: 2400,
          className: 'fixora-toast',
          success: {
            className: 'fixora-toast fixora-toast-success',
            iconTheme: {
              primary: '#6366F1',
              secondary: '#FFFFFF',
            },
          },
          error: {
            className: 'fixora-toast fixora-toast-error',
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      <Footer />
    </div>
  )
}

export default MainLayout
