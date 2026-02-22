import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from "../context/ThemeContext"

export default function Navbar() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-gray-500/40 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/upload" className="text-2xl font-bold gradient-text flex items-center space-x-2">
                            <span className="text-3xl glow">⚡</span>
                            <span>Analytica</span>
                        </Link>
                        <div className="hidden md:flex space-x-1">
                            <Link to="/upload" className="text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all hover:bg-slate-800/50">
                                📁 Upload
                            </Link>
                            <Link to="/reports" className="text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all hover:bg-slate-800/50">
                                📊 Reports
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-6">
                            🚪 Logout
                        </button>
                        <button onClick={toggleTheme} title="Toggle theme" className='btn-secondary text-sm py-2 px-4'>
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}