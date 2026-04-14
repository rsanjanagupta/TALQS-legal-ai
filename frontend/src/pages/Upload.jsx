import React, { useState } from 'react'
import UploadBox from '../components/UploadBox'
import { uploadDocument } from '../services/api'
import { useAuth } from '../context/AuthContext.jsx'

const Upload = () => {
  const { user, setDocumentName } = useAuth()

  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    setError('')
    setSuccess(false)
    setProgress(0)

    if (!selected) { setFile(null); return }

    if (selected.type !== 'application/pdf') {
      setError('Only PDF files are supported at the moment.')
      setFile(null)
      return
    }

    setFile(selected)
  }

  const handleUpload = async () => {
    if (!file || !user?.user_id) return
    setError('')
    setSuccess(false)
    setUploading(true)
    setProgress(0)

    try {
      // Pass user_id as required by backend FormData field
      await uploadDocument(user.user_id, file, (event) => {
        if (!event.total) return
        setProgress(Math.round((event.loaded * 100) / event.total))
      })

      // Store the filename so QA / Summarize pages can reference it
      setDocumentName(file.name)
      setSuccess(true)
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          'Upload failed. Please try again.',
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Upload Document</h1>
      <UploadBox
        file={file}
        onFileChange={handleFileChange}
        onUpload={handleUpload}
        uploading={uploading}
        progress={progress}
        error={error}
        success={success}
      />
    </div>
  )
}

export default Upload
