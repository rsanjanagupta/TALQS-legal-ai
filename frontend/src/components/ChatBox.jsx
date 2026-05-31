import React from 'react'

const ChatBubble = ({ role, content }) => {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
  ? 'bg-indigo-500 text-white rounded-br-sm'
  : 'bg-slate-900/70 border border-slate-800 rounded-bl-sm text-slate-100'
        }`}
      >
        {content}
      </div>
    </div>
  )
}

const ChatBox = ({
  messages,
  input,
  onInputChange,
  onSend,
  loading,
  error,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="flex flex-col h-[70vh] bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Legal Q&amp;A</h2>
          <p className="text-xs text-neutral-400">
            Ask Legal AI precise questions about your uploaded documents.
          </p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-3 w-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
            <span>Thinking…</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-sm text-slate-500 text-center px-10">
            Ask questions like:
            <br />
            &quot;What are the key obligations of the tenant in this
            lease?&quot;
          </div>
        )}
        {messages.map((m, idx) => (
          <ChatBubble key={idx} role={m.role} content={m.content} />
        ))}
      </div>

      {error && (
        <div className="px-5 py-2 text-xs text-red-400 bg-red-950/40 border-t border-red-900/60">
          {error}
        </div>
      )}

      <div className="border-t border-slate-800 bg-slate-900/70 px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a specific legal question about your document…"
            className="flex-1 resize-none bg-slate-900 text-sm text-slate-100 placeholder:text-slate-500 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-talqsAccent/60 focus:border-talqsAccent/80 px-3 py-2"
          />
          <button
  onClick={onSend}
  disabled={!input.trim() || loading}
  className={`inline-flex items-center justify-center h-10 w-24 rounded-xl text-sm font-medium transition ${
    !input.trim() || loading
      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
      : "bg-indigo-500 hover:bg-indigo-600 text-white"
  }`}
>
  {loading ? "Sending..." : "Send"}
</button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox

