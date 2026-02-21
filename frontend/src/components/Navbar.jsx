import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navLinkClass = (path) => `
    px-4 py-2 rounded-lg font-medium transition-all duration-200
    ${isActive(path) 
      ? 'bg-primary-500/20 text-primary-400' 
      : 'text-gray-400 hover:text-white hover:bg-white/5'}
  `

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
              <svg className="w-6 h-6 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              Algorithmic Arena
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            <Link to="/problems" className={navLinkClass('/problems')}>
              Problems
            </Link>
            {/* <Link 
                                to="/contests"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md font-medium"
                            >
                                Contests
                            </Link> */}
            <Link to="/contests" className={navLinkClass('/contests')}>
              Contests
            </Link>
            {user ? (
              <>
                <Link to="/submissions" className={navLinkClass('/submissions')}>
                  Submissions
                </Link>
                
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-surface-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-300 font-medium hidden sm:block">
                      {user.username}
                    </span>
                  </div>
                  
                  <button 
                    onClick={logout}
                    className="btn btn-ghost text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link to="/login" className="btn btn-ghost">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar