import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

/**
 * user shape stored in context & localStorage:
 * {
 *   uid:        string   ← Firebase UID (or local fallback)
 *   user_id:    string   ← MongoDB _id returned by /auth/google
 *   email:      string
 *   name:       string
 *   picture:    string
 *   provider:   string
 *   documentName: string | null   ← set after a successful upload
 * }
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('talqs_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('talqs_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('talqs_user')
  }

  // Call this after a successful upload so QA / Summarize know the filename
  const setDocumentName = (name) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, documentName: name }
      localStorage.setItem('talqs_user', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setDocumentName }}>
      {children}
    </AuthContext.Provider>
  )
}
