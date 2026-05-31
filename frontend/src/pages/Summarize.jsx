import React, { useState } from 'react'
import { summarizeDocument } from '../services/api'
import { useAuth } from '../context/AuthContext.jsx'

const Summarize = () => {
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')
  const [document, setDocument] = useState('')
  const [error, setError] = useState('')

  const handleSummarize = async () => {
    if (!user?.user_id) {
      setError('You must be logged in to summarize.')
      return
    }

    setLoading(true)
    setError('')
    setSummary('')

    try {
      // Backend expects: { user_id }
      const res = await summarizeDocument(user.user_id,user.documentName)
      const text =
        res.data?.summary ||
        'The backend did not return a summary field. Please check the API.'
      setSummary(text)
      setDocument(res.data?.document || '')
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          'Unable to generate a summary right now.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Summarize Document</h1>
        {user?.documentName && (
          <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1">
            📎 {user.documentName}
          </span>
        )}
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
        <p className="text-sm text-slate-300">
          Generate a structured summary of your currently active document,
          including key clauses, obligations, and risk points.
        </p>

        {!user?.documentName && (
          <div className="text-sm text-amber-400 bg-amber-950/40 border border-amber-900/60 rounded-lg px-4 py-3">
            No document loaded. Please{' '}
            <a href="/upload" className="underline">
              upload a PDF
            </a>{' '}
            first.
          </div>
        )}

        <button
          onClick={handleSummarize}
          disabled={loading || !user?.documentName}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
  loading || !user?.documentName
    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
    : "bg-indigo-500 hover:bg-indigo-600 text-white"
}`}
        >
          {loading && (
            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          <span>{loading ? 'Generating…' : 'Generate Summary'}</span>
        </button>

        {error && (
          <div className="text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="mt-2">
          {document && (
            <p className="text-xs text-slate-500 mb-2">📄 {document}</p>
          )}
          <h2 className="text-sm font-semibold mb-2">Summary</h2>
          <div className="min-h-[160px] max-h-[320px] overflow-y-auto bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 whitespace-pre-wrap">
            {summary || (
              <span className="text-slate-500">
                No summary generated yet. Click &quot;Generate Summary&quot; to
                get started.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Summarize
