import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
    const { logout, user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const menuRef = useRef(null)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

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
        { path: '/reports', label: 'Projects' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 border-b border-slate-700/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Logo */}
                    <Link to="/upload" className="flex items-center space-x-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all">
                            <span className="text-white text-lg">🔥</span>
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">Analytica</span>
                    </Link>

                    {/* Center: Nav Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive(link.path)
                                        ? 'text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                    }`}
                            >
                                {link.label}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full"></span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Notification + Avatar */}
                    <div className="flex items-center space-x-3">
                        {/* Notification bell */}
                        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                            {/* Notification dot */}
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
                        </button>

                        {/* User Avatar + Dropdown */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold border-2 border-transparent hover:border-purple-400/50 transition-all shadow-lg shadow-purple-500/20"
                            >
                                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                            </button>

                            {/* Dropdown menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-800 border border-slate-700/50 shadow-2xl shadow-black/50 py-1 fade-in-up">
                                    <div className="px-4 py-3 border-b border-slate-700/50">
                                        <p className="text-sm text-white font-medium truncate">{user?.name || 'User'}</p>
                                        <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
                                    </div>
                                    <Link
                                        to="/upload"
                                        className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        📁 Upload
                                    </Link>
                                    <Link
                                        to="/reports"
                                        className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        📊 Reports
                                    </Link>
                                    <div className="border-t border-slate-700/50 mt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-slate-700/50 transition-colors"
                                        >
                                            🚪 Sign out
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
