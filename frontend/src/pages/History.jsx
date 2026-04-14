import React, { useEffect, useState } from 'react'
import QuestionHistory from '../components/QuestionHistory'
import { fetchQAHistory, fetchSummaryHistory } from '../services/api'
import { useAuth } from '../context/AuthContext.jsx'

const SummaryHistoryItem = ({ item }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center px-4 py-3 text-left hover:bg-slate-800/60 transition"
      >
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-100">
            {item.document_name}
          </span>
          <span className="text-xs text-slate-500 mt-1">
            {item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}
          </span>
        </div>
        <span
          className={`text-slate-400 text-xs transform transition-transform ${open ? 'rotate-90' : ''}`}
        >
          ▶
        </span>
      </button>
      {open && (
        <div className="border-t border-slate-800 px-4 py-3 text-sm text-slate-200 bg-slate-900 whitespace-pre-wrap">
          {item.summary}
        </div>
      )}
    </div>
  )
}

const History = () => {
  const { user } = useAuth()

  const [qaItems, setQaItems] = useState([])
  const [summaryItems, setSummaryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('qa') // 'qa' | 'summaries'

  useEffect(() => {
    if (!user?.user_id) return

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [qaRes, sumRes] = await Promise.all([
          fetchQAHistory(user.user_id),
          fetchSummaryHistory(user.user_id),
        ])
        if (!cancelled) {
          // Backend returns { count, history: [...] } and { count, summaries: [...] }
          setQaItems(qaRes.data?.history || [])
          setSummaryItems(sumRes.data?.summaries || [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.detail ||
              err?.message ||
              'Unable to load history.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [user?.user_id])

  // Normalise QA items so QuestionHistory component gets the right field names
  // Backend stores: { question, answer, timestamp, pages, document_name }
  const normalisedQA = qaItems.map((item) => ({
    ...item,
    created_at: item.timestamp, // QuestionHistory reads created_at
  }))

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">History</h1>
      <p className="text-sm text-neutral-400">
        Review past questions and generated summaries.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setTab('qa')}
          className={`text-sm px-3 py-1.5 rounded-md font-medium transition ${
            tab === 'qa'
              ? 'bg-white text-black'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Questions ({qaItems.length})
        </button>
        <button
          onClick={() => setTab('summaries')}
          className={`text-sm px-3 py-1.5 rounded-md font-medium transition ${
            tab === 'summaries'
              ? 'bg-white text-black'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Summaries ({summaryItems.length})
        </button>
      </div>

      {tab === 'qa' && (
        <QuestionHistory items={normalisedQA} loading={loading} error={error} />
      )}

      {tab === 'summaries' && (
        loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-400 bg-red-950/40 border border-red-900/60 rounded-lg px-3 py-2">
            {error}
          </div>
        ) : summaryItems.length === 0 ? (
          <div className="text-sm text-slate-500 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-6 text-center">
            No summaries yet. Generate one on the Summarize page.
          </div>
        ) : (
          <div className="space-y-3">
            {summaryItems.map((item, i) => (
              <SummaryHistoryItem key={item._id || i} item={item} />
            ))}
          </div>
        )
      )}
    </div>
  )
}

export default History
