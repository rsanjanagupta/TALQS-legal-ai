import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-16">
      {/* Hero + primary features */}
      <section className="bg-black border border-neutral-800 rounded-2xl p-8 md:p-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-3">
              Legal AI Platform
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mb-3">
              Modern Legal Questioning &amp; Summarization
            </h1>
            <p className="text-sm text-neutral-300 mb-6">
              Legal AI helps you interrogate complex contracts, policies, and
              case materials, turning dense documents into clear answers and
              concise summaries.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/qa')}
                className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-neutral-200 transition"
              >
                Start asking questions
              </button>
              <button
                onClick={() => navigate('/summarize')}
                className="px-4 py-2 rounded-full border border-neutral-700 text-sm text-white hover:bg-neutral-900 transition"
              >
                Generate a summary
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-1">Clause‑aware Q&amp;A</h3>
              <p className="text-xs text-neutral-300">
                Ask precise questions like &quot;What are the renewal terms?&quot; or
                &quot;Who carries indemnity risk?&quot; and receive grounded, document‑aware
                answers.
              </p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-1">Deal‑ready summaries</h3>
              <p className="text-xs text-neutral-300">
                Turn long contracts into short, structured briefs you can share with
                clients and colleagues.
              </p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-1">Audit‑friendly history</h3>
              <p className="text-xs text-neutral-300">
                Every question and answer is stored in a workspace history so you can
                review, justify, and reuse prior analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary feature grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold mb-1">Multi‑document context</h3>
          <p className="text-xs text-neutral-300">
            Compare terms across multiple agreements and quickly spot differences in
            obligations and risk.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold mb-1">Issue spotting</h3>
          <p className="text-xs text-neutral-300">
            Highlight non‑standard clauses and missing protections based on your
            review patterns.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold mb-1">Workspace‑ready</h3>
          <p className="text-xs text-neutral-300">
            Keep all of your questions, answers, and summaries in one place for each
            matter or client.
          </p>
        </div>
      </section>

      {/* Scroll‑down upload call to action */}
      <section className="bg-black border border-neutral-800 rounded-2xl p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Ready to start?</h2>
            <p className="text-sm text-neutral-300">
              Upload a contract, policy, or case bundle to let Legal AI begin its
              analysis. You can then ask questions and generate summaries based on
              that document.
            </p>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="self-start px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-neutral-200 transition"
          >
            Upload a document
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home

