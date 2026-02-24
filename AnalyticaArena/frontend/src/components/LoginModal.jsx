import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'))
    const { login } = useAuth()
    const navigate = useNavigate()

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            const response = await authAPI.login(email, password)
            login(response.data.access_token)
            onClose()
            navigate('/upload')
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose()
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md modal-backdrop"
            onClick={handleBackdropClick}
        >
            <div className={`animate-modal-pop w-full max-w-md backdrop-blur-2xl border shadow-2xl rounded-2xl p-8 relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>

                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
                    </div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Welcome Back</h2>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Please sign in to your account</p>
                </div>

                {error && (
                    <div className={`px-4 py-3 rounded-xl mb-5 text-sm border ${isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className={`block text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined text-lg">mail_outline</span>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-10 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all ${isDark ? 'bg-white/5 border-white/10 text-gray-100 placeholder-gray-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`}
                                placeholder="you@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label className={`block text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Password</label>
                            <a className="text-xs text-primary font-medium hover:text-primary-hover transition-colors" href="#">Forgot Password?</a>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined text-lg">lock_outline</span>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full pl-10 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all ${isDark ? 'bg-white/5 border-white/10 text-gray-100 placeholder-gray-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex h-12 justify-center items-center rounded-xl text-base font-bold tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        style={{ background: 'linear-gradient(135deg, #f97316, #db2777)', boxShadow: '0 0 20px rgba(219,39,119,0.4)' }}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Signing in...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <span>Sign In</span>
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </span>
                        )}
                    </button>
                </form>

                <p className={`mt-6 text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Don't have an account?{' '}
                    <button
                        onClick={() => { onClose(); onSwitchToRegister() }}
                        className="font-medium text-primary hover:text-primary-hover transition-colors"
                    >
                        Create one now
                    </button>
                </p>
            </div>
        </div>
    )
}
