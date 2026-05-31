import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Home from './pages/Home'
import Upload from './pages/Upload'
import QA from './pages/QA'
import Summarize from './pages/Summarize'
import History from './pages/History'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

const AppShell = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {user && <Navbar />}
      <main className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/qa"
              element={
                <ProtectedRoute>
                  <QA />
                </ProtectedRoute>
              }
            />
            <Route
              path="/summarize"
              element={
                <ProtectedRoute>
                  <Summarize />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

export default App
