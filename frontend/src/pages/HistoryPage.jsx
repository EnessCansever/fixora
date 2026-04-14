import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { deleteHistory, getHistoryDetail, getHistoryList } from '../services/historyApi'

function formatDate(value) {
  try {
    return new Date(value).toLocaleString('tr-TR')
  } catch {
    return value
  }
}

function HistoryPage() {
  const [historyItems, setHistoryItems] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [selectedDetail, setSelectedDetail] = useState(null)
  const [isListLoading, setIsListLoading] = useState(true)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [listError, setListError] = useState('')
  const [detailError, setDetailError] = useState('')

  useEffect(() => {
    async function fetchHistory() {
      setIsListLoading(true)
      setListError('')

      try {
        const data = await getHistoryList()
        setHistoryItems(data)

        if (data.length > 0) {
          setSelectedId(data[0]._id)
        }
      } catch (error) {
        setListError(error.message)
      } finally {
        setIsListLoading(false)
      }
    }

    fetchHistory()
  }, [])

  useEffect(() => {
    async function fetchDetail() {
      if (!selectedId) {
        setSelectedDetail(null)
        return
      }

      setIsDetailLoading(true)
      setSelectedDetail(null)
      setDetailError('')

      try {
        const detail = await getHistoryDetail(selectedId)
        setSelectedDetail(detail)
      } catch (error) {
        setDetailError(error.message)
      } finally {
        setIsDetailLoading(false)
      }
    }

    fetchDetail()
  }, [selectedId])

  const handleDelete = async (itemId) => {
    const confirmed = window.confirm('Bu kaydi silmek istediginize emin misiniz?')

    if (!confirmed) {
      return
    }

    setListError('')
    setDetailError('')
    setDeletingId(itemId)

    try {
      await deleteHistory(itemId)
      toast.success('Kayıt silindi.')

      const updatedItems = historyItems.filter((item) => item._id !== itemId)
      setHistoryItems(updatedItems)

      if (selectedId === itemId) {
        if (updatedItems.length > 0) {
          setSelectedId(updatedItems[0]._id)
        } else {
          setSelectedId('')
          setSelectedDetail(null)
        }
      }
    } catch (error) {
      const message = error.message || 'Kayit silinemedi.'
      setListError(message)
      toast.error('Kayıt silinemedi.')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <section className="space-y-5 sm:space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6366F1]">
          History
        </p>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">Analiz Gecmisi</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Son analizleri listeden secerek detaylarini gorebilirsin.
        </p>
      </header>

      {listError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
          {listError}
        </div>
      )}

      {detailError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          {detailError}
        </div>
      )}

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Son Analizler</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{historyItems.length} kayit</span>
          </div>

          {isListLoading && (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Gecmis yukleniyor...</p>
          )}

          {!isListLoading && historyItems.length === 0 && (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Henuz kayitli analiz bulunmuyor.</p>
          )}

          {!isListLoading && historyItems.length > 0 && (
            <ul className="mt-3 space-y-2">
              {historyItems.map((item) => {
                const isActive = selectedId === item._id
                const isDeleting = deletingId === item._id

                return (
                  <li key={item._id}>
                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start">
                      <button
                        type="button"
                        onClick={() => setSelectedId(item._id)}
                        className={`min-w-0 flex-1 rounded-lg border px-3 py-3 text-left transition ${
                          isActive
                            ? 'border-[#6366F1] bg-[#6366F1] text-white'
                            : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
                          {item.category}
                        </p>
                        <p className="mt-1 line-clamp-2 wrap-break-word text-sm font-medium">
                          {item.errorMessage}
                        </p>
                        <p className="mt-1 text-xs opacity-70">{formatDate(item.createdAt)}</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        disabled={isDeleting}
                        className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-400/40 dark:hover:bg-red-500/10 dark:hover:text-red-300 sm:min-h-0 sm:w-auto sm:px-2 sm:py-1"
                      >
                        {isDeleting ? 'Siliniyor...' : 'Sil'}
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Detay</h3>

          {isDetailLoading && (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Detay yukleniyor...</p>
          )}

          {!isDetailLoading && !selectedDetail && (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Detay gormek icin listeden bir kayit sec.</p>
          )}

          {!isDetailLoading && selectedDetail && (
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Kategori</p>
                <p className="wrap-break-word text-slate-700 dark:text-slate-300">{selectedDetail.category}</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Kisa Ozet</p>
                <p className="wrap-break-word text-slate-700 dark:text-slate-300">{selectedDetail.shortSummary}</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Hata Mesaji</p>
                <p className="wrap-break-word text-slate-700 dark:text-slate-300">{selectedDetail.errorMessage}</p>
              </div>

              {selectedDetail.codeSnippet && (
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Kod Parcasi</p>
                  <pre className="mt-1 max-w-full overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100 dark:bg-slate-950">
                    <code>{selectedDetail.codeSnippet}</code>
                  </pre>
                </div>
              )}

              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Olusturma Zamani</p>
                <p className="wrap-break-word text-slate-700 dark:text-slate-300">{formatDate(selectedDetail.createdAt)}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  )
}

export default HistoryPage
