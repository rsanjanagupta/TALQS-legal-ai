import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
})

// ── Upload ────────────────────────────────────────────────────────────────────
// Backend: POST /upload  expects multipart: user_id (Form) + file (File)
export const uploadDocument = (userId, file, onUploadProgress) => {
  const formData = new FormData()
  formData.append('user_id', userId)
  formData.append('file', file)

  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })
}

// ── Q&A ───────────────────────────────────────────────────────────────────────
// Backend: POST /ask  expects { user_id, document_name, question }
export const askQuestion = (userId, documentName, question) => {
  return api.post('/ask', {
    user_id: userId,
    document_name: documentName,
    question,
  })
}

// ── Summarize ────────────────────────────────────────────────────────────────
// Backend: POST /summarize  expects { user_id }
export const summarizeDocument = (userId, filename) => {
  return api.post('/summarize', { user_id: userId, filename: filename })
}

// ── History ───────────────────────────────────────────────────────────────────
// Backend: GET /history/qa/{user_id}  → { count, history: [...] }
export const fetchQAHistory = (user_id) =>
  axios.get(`http://localhost:8000/qa/history/${user_id}`)

// Backend: GET /history/summaries/{user_id}  → { count, summaries: [...] }
export const fetchSummaryHistory = (user_id) =>
  axios.get(`http://localhost:8000/summaries/history/${user_id}`)

// ── Auth ──────────────────────────────────────────────────────────────────────
// Backend: POST /auth/google  expects { google_id, email, name, picture }
export const googleAuthBackend = (userData) => {
  return api.post('/auth/google', userData)
}

// ── Document status ───────────────────────────────────────────────────────────
export const fetchDocumentStatus = (userId) => {
  return api.get(`/status/${userId}`)
}

export default api