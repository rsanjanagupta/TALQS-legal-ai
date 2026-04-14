import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const linkBase =
  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors'
const linkActive = 'bg-white text-black'
const linkInactive =
  'text-neutral-300 hover:bg-neutral-800/60 hover:text-white'

const Navbar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="border-b border-neutral-800 bg-black/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-black font-semibold text-lg">L</span>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide">Legal AI</div>
            <div className="text-xs text-neutral-400">
              Intelligent legal assistant
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-100">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Upload
          </NavLink>
          <NavLink
            to="/qa"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            QA
          </NavLink>
          <NavLink
            to="/summarize"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Summarize
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            History
          </NavLink>

          <button
            onClick={handleLogout}
            className="ml-3 px-3 py-1.5 rounded-md text-sm font-medium border border-neutral-700 text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

