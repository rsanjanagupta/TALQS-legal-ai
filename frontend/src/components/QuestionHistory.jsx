import React, { useState } from 'react'

const QuestionHistoryItem = ({ item }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center px-4 py-3 text-left hover:bg-slate-800/60 transition"
      >
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-100 line-clamp-2">
            {item.question}
          </span>
          <span className="text-xs text-slate-500 mt-1">
            {item.created_at
              ? new Date(item.created_at).toLocaleString()
              : ''}
          </span>
        </div>
        <span
          className={`text-slate-400 text-xs transform transition-transform ${
            open ? 'rotate-90' : ''
          }`}
        >
          ▶
        </span>
      </button>
      {open && (
        <div className="border-t border-slate-800 px-4 py-3 text-sm text-slate-200 bg-slate-900">
          {item.answer}
        </div>
      )}
    </div>
  )
}

const QuestionHistory = ({ items, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-red-400 bg-red-950/40 border border-red-900/60 rounded-lg px-3 py-2">
        {error}
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="text-sm text-slate-500 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-6 text-center">
        No previous questions yet. Ask something in the QA page and your
        interactions will appear here.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <QuestionHistoryItem key={item.id || item.created_at} item={item} />
      ))}
    </div>
  )
}

export default QuestionHistory

