import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { useAuth } from '../context/AuthContext.jsx'
import { googleAuthBackend } from '../services/api'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

 
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [error, setError] = useState('')

  // ── Email/password (local demo – swap for real backend auth if needed) ──────

  // ── Google login via Firebase + backend registration ──────────────────────
  const handleGoogleLogin = async () => {
    setError('')
    setLoadingGoogle(true)

    try {
      // 1. Firebase popup
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user

      // 2. Register / fetch user from TALQS backend
      const backendRes = await googleAuthBackend({
        google_id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email,
        picture: firebaseUser.photoURL || '',
      })

      // backendRes.data = { user_id: "<mongo _id>" }
      const user = {
        uid: firebaseUser.uid,
        user_id: backendRes.data.user_id,   // ← MongoDB _id used in all API calls
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email,
        picture: firebaseUser.photoURL || '',
        provider: 'google',
        documentName: null,
      }

      login(user)
      navigate(from, { replace: true })
    } catch (err) {
      console.error('Google login error:', err)
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          'Google sign-in failed. Please try again.',
      )
    } finally {
      setLoadingGoogle(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-xl shadow-black/40">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center">
              <span className="text-black font-semibold text-xl">L</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">Legal AI</h1>
              <p className="text-xs text-neutral-400">
                Modern Legal Questioning &amp; Summarization
              </p>
            </div>
          </div>

          <h2 className="text-sm font-medium mb-1">Continue with Google</h2>
          <p className="text-xs text-neutral-400 mb-5">
            Securely access your Legal AI workspace.
          </p>

          {error && (
            <div className="text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded-lg px-3 py-2 mb-4">
              {error}
            </div>
          )}

          

          

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loadingGoogle}
            className="w-full inline-flex items-center justify-center gap-2 border border-neutral-700 bg-black hover:bg-neutral-900 text-white text-sm font-medium rounded-lg py-2.5 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loadingGoogle ? (
              <span className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>
            <p className="text-xs text-neutral-500 text-center mt-3">
  New users will be automatically registered.
</p>
          
        </div>
      </div>
    </div>
  )
}

export default Login
