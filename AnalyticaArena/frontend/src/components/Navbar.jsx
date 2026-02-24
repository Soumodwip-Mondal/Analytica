import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useRef, useEffect } from 'react'

// Theme toggle helper
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.theme = isDark ? 'dark' : 'light'
}

export default function Navbar() {
    const { logout, user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'))
    const menuRef = useRef(null)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleThemeToggle = () => {
        toggleTheme()
        setIsDark(document.documentElement.classList.contains('dark'))
    }

    // Sync isDark when dark class is modified outside
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsDark(document.documentElement.classList.contains('dark'))
                }
            })
        })
        observer.observe(document.documentElement, { attributes: true })
        return () => observer.disconnect()
    }, [])

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowUserMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const navLinks = [
        { path: '/upload', label: 'Dashboard' },
        { path: '/reports', label: 'Reports' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                background: isDark ? 'rgba(15, 23, 42, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
            }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Logo */}
                    <Link to="/upload" className="flex items-center space-x-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-rose-500 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all">
                            <span className="material-symbols-outlined text-white text-[18px]">analytics</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Analytica</span>
                    </Link>

                    {/* Center: Nav Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive(link.path)
                                    ? 'text-primary bg-orange-50 dark:bg-orange-500/10'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                {link.label}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full"></span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Theme Toggle + Avatar */}
                    <div className="flex items-center space-x-3">
                        {/* Theme toggle */}
                        <button
                            onClick={handleThemeToggle}
                            aria-label="Toggle theme"
                            className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all"
                        >
                            {isDark ? (
                                <span className="material-symbols-outlined text-yellow-400 text-[20px]">light_mode</span>
                            ) : (
                                <span className="material-symbols-outlined text-[20px]">dark_mode</span>
                            )}
                        </button>

                        {/* User Avatar + Dropdown */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold hover:ring-2 hover:ring-indigo-400/50 transition-all shadow-md"
                            >
                                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                            </button>

                            {/* Dropdown menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 shadow-2xl shadow-black/10 dark:shadow-black/50 py-1.5 fade-in-up overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50">
                                        <p className="text-sm text-slate-900 dark:text-white font-semibold truncate">{user?.name || 'User'}</p>
                                        <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
                                    </div>
                                    <Link
                                        to="/upload"
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-orange-50 dark:hover:bg-slate-700/50 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                                        Upload Data
                                    </Link>
                                    <Link
                                        to="/reports"
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-orange-50 dark:hover:bg-slate-700/50 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">description</span>
                                        Reports
                                    </Link>
                                    <div className="border-t border-slate-100 dark:border-slate-700/50 mt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-500 hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">logout</span>
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
