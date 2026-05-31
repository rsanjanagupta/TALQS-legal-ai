import React from 'react'

const UploadBox = ({
  file,
  onFileChange,
  onUpload,
  uploading,
  progress,
  error,
  success,
}) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold mb-1">Upload legal document</h2>
        <p className="text-sm text-neutral-400">
          Legal AI currently accepts PDF documents for analysis, questioning, and
          summarization.
        </p>
      </div>

      <label className="border-2 border-dashed border-neutral-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-white/60 hover:bg-neutral-900/70 transition">
        <span className="text-sm font-medium text-neutral-100">
          Click to select a PDF
        </span>
        <span className="text-xs text-neutral-400">
          or drag and drop (max ~25MB, PDF only)
        </span>
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={onFileChange}
        />
      </label>

      {file && (
        <div className="text-sm text-neutral-200">
          Selected: <span className="font-medium">{file.name}</span>
        </div>
      )}

      {uploading && (
        <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-white transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <div className="text-sm text-red-400 bg-red-950/40 border border-red-900/60 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 rounded-lg px-3 py-2">
          Document uploaded successfully.
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onUpload}
          disabled={!file || uploading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {uploading && (
            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          <span>{uploading ? 'Uploading…' : 'Upload PDF'}</span>
        </button>
      </div>
    </div>
  )
}

export default UploadBox

