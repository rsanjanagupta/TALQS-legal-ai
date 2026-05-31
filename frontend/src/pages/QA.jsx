import React, { useState } from 'react'
import ChatBox from '../components/ChatBox'
import { askQuestion } from '../services/api'
import { useAuth } from '../context/AuthContext.jsx'

const QA = () => {
  const { user } = useAuth()

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    if (!user?.user_id) {
      setError('You must be logged in to ask questions.')
      return
    }

    if (!user?.documentName) {
      setError('Please upload a document first before asking questions.')
      return
    }

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    setError('')
    setLoading(true)

    try {
      // Backend expects: { user_id, document_name, question }
      const res = await askQuestion(user.user_id, user.documentName, trimmed)
      const answer =
        res.data?.answer ||
        'The backend did not return an answer field. Please check the API.'

      const pages = res.data?.pages
      const pageNote =
        pages?.length > 0 ? `\n\n📄 Source pages: ${pages.join(', ')}` : ''

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: answer + pageNote },
      ])
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          'Unable to get an answer from Legal AI right now.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Ask Questions</h1>
        {user?.documentName && (
          <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1">
            📎 {user.documentName}
          </span>
        )}
      </div>

      {!user?.documentName && (
        <div className="text-sm text-amber-400 bg-amber-950/40 border border-amber-900/60 rounded-lg px-4 py-3">
          No document loaded. Please{' '}
          <a href="/upload" className="underline">
            upload a PDF
          </a>{' '}
          before asking questions.
        </div>
      )}

      <ChatBox
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
        loading={loading}
        error={error}
      />
    </div>
  )
}

export default QA
