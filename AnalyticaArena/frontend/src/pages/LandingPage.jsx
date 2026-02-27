import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage({ onOpenLogin, onOpenRegister }) {
    const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'))

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

    const handleThemeToggle = () => {
        const newIsDark = document.documentElement.classList.toggle('dark')
        localStorage.theme = newIsDark ? 'dark' : 'light'
        setIsDark(newIsDark)
    }

    return (
        <div className={`flex flex-col flex-1`}>


            {/* ── HEADER ── */}
            <header className="w-full z-50 fixed top-0 transition-all duration-300"
                style={{
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    background: isDark ? 'rgba(15, 23, 42, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                    borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
                }}>
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">

                    {/* Logo */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 items-center justify-center text-white shadow-lg shadow-pink-500/20">
                            <span className="material-symbols-outlined text-xl" style={{ fontSize: '18px' }}>bolt</span>
                        </div>
                        <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Analytica</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-orange-500'}`} to="/features">Features</Link>
                        <Link className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-orange-500'}`} to="/about">About</Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <button
                            aria-label="Toggle Dark Mode"
                            onClick={handleThemeToggle}
                            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}
                        >
                            {isDark ? (
                                <span className="material-symbols-outlined text-yellow-300 text-[20px]">light_mode</span>
                            ) : (
                                <span className="material-symbols-outlined text-[20px]">dark_mode</span>
                            )}
                        </button>
                        <button
                            onClick={onOpenLogin}
                            className={`hidden sm:flex h-9 px-4 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${isDark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100'}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={onOpenRegister}
                            className="flex h-9 px-4 items-center justify-center rounded-lg text-white text-sm font-semibold shadow-lg transition-all"
                            style={{ background: 'linear-gradient(135deg, #f97316, #db2777)', boxShadow: '0 4px 14px rgba(219,39,119,0.3)' }}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* ── MAIN HERO ── */}
            <main className="relative z-10 flex-grow flex flex-col justify-center items-center px-4 pt-32 pb-20 sm:pt-40 sm:pb-24">

                <div className="w-full max-w-[1000px] flex flex-col items-center text-center gap-8 mb-20 sm:mb-24">



                    {/* Bolt icon */}
                    <div className="relative flex justify-center">
                        <div className="relative" style={{ animation: 'float 6s ease-in-out infinite' }}>
                            <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 rounded-full"></div>
                            <span
                                className="material-symbols-outlined block"
                                style={{
                                    fontSize: '96px',
                                    lineHeight: 1,
                                    background: 'linear-gradient(to right, #f97316, #db2777)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: 'none',
                                    filter: 'drop-shadow(0 0 20px rgba(249,115,22,0.4))'
                                }}
                            >
                                bolt
                            </span>
                        </div>
                    </div>

                    {/* Heading group */}
                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] pb-2 animate-text-reveal"
                            style={{
                                background: 'linear-gradient(to right, #f97316, #db2777)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                            Analytica
                        </h1>
                        <div className="relative">
                            <h2 className={`text-2xl md:text-3xl font-medium typewriter-text ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                AI-Powered Analytics Platform
                            </h2>
                        </div>
                        <p className={`max-w-2xl text-lg leading-relaxed fade-in-up ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ animationDelay: '0.4s' }}>
                            Unlock the hidden potential of your data with our next-generation AI models. Visualize, predict, and act in real-time.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <button
                            onClick={onOpenLogin}
                            className="flex h-12 px-8 rounded-xl text-white text-base font-bold tracking-wide items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 shimmer-button"
                            style={{ background: 'linear-gradient(135deg, #f97316, #db2777)', boxShadow: '0 0 20px rgba(219,39,119,0.4)' }}
                        >
                            <span>Sign In</span>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                        <button
                            onClick={onOpenRegister}
                            className={`flex h-12 px-8 rounded-xl border text-base font-bold tracking-wide items-center justify-center transition-colors backdrop-blur-sm ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' : 'border-slate-300 bg-white shadow-sm hover:bg-slate-50 text-slate-800'}`}
                        >
                            Create Account
                        </button>
                    </div>
                </div>

                {/* ── FEATURE CARDS ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1100px] mx-auto relative z-10">

                    {/* Card 1: AI-Powered */}
                    <div className={`group relative p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 stagger-item
                        ${isDark ? 'border-white/10 shadow-none hover:border-orange-500/30' : 'border border-slate-200/50 shadow-lg shadow-orange-500/5 hover:shadow-xl hover:border-orange-500/30'}`}
                        style={{
                            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                            background: isDark
                                ? 'radial-gradient(at 0% 0%, rgba(249, 115, 22, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.1) 0px, transparent 50%), rgba(255,255,255,0.05)'
                                : 'radial-gradient(at 0% 0%, rgba(249, 115, 22, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.05) 0px, transparent 50%), rgba(255,255,255,0.7)',
                            ...(isDark && {
                                border: '1px solid rgba(255,255,255,0.1)'
                            })
                        }}>

                        <div className="absolute top-0 left-0 right-0 h-px"
                            style={{ background: `linear-gradient(90deg, transparent, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(249,115,22,0.3)'}, transparent)` }}>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 group-hover:scale-110 
                                ${isDark ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 group-hover:bg-orange-500/20' : 'bg-orange-50 border-orange-100 text-orange-500 group-hover:bg-orange-100'}`}
                                style={{ transition: 'box-shadow 0.3s ease' }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(249,115,22,0.3)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                                <span className="material-symbols-outlined text-3xl">smart_toy</span>
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold mb-2 transition-colors ${isDark ? 'text-white group-hover:text-orange-200' : 'text-slate-900 group-hover:text-orange-600'}`}>AI-Powered</h3>
                                <p className={`text-sm leading-relaxed transition-colors ${isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-600 group-hover:text-slate-700'}`}>
                                    Leverage advanced machine learning models to predict trends and automate complex data analysis workflows instantly.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Visualizations */}
                    <div className={`group relative p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 stagger-item
                        ${isDark ? 'border-white/10 shadow-none hover:border-pink-500/30' : 'border border-slate-200/50 shadow-lg shadow-pink-500/5 hover:shadow-xl hover:border-pink-500/30'}`}
                        style={{
                            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                            background: isDark
                                ? 'radial-gradient(at 100% 0%, rgba(249, 115, 22, 0.1) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(236, 72, 153, 0.15) 0px, transparent 50%), rgba(255,255,255,0.05)'
                                : 'radial-gradient(at 100% 0%, rgba(249, 115, 22, 0.08) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(236, 72, 153, 0.1) 0px, transparent 50%), rgba(255,255,255,0.7)',
                            ...(isDark && {
                                border: '1px solid rgba(255,255,255,0.1)'
                            })
                        }}>

                        <div className="absolute top-0 left-0 right-0 h-px"
                            style={{ background: `linear-gradient(90deg, transparent, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(249,115,22,0.3)'}, transparent)` }}>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 group-hover:scale-110 
                                ${isDark ? 'bg-pink-500/10 border-pink-500/20 text-pink-400 group-hover:bg-pink-500/20' : 'bg-pink-50 border-pink-100 text-pink-600 group-hover:bg-pink-100'}`}>
                                <span className="material-symbols-outlined text-3xl">monitoring</span>
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold mb-2 transition-colors ${isDark ? 'text-white group-hover:text-purple-200' : 'text-slate-900 group-hover:text-purple-600'}`}>Visualizations</h3>
                                <p className={`text-sm leading-relaxed transition-colors ${isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-600 group-hover:text-slate-700'}`}>
                                    Turn raw numbers into stunning, interactive charts and graphs that tell a compelling story at a glance.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Chat Interface */}
                    <div className={`group relative p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 stagger-item
                        ${isDark ? 'border-white/10 shadow-none hover:border-orange-400/30' : 'border border-slate-200/50 shadow-lg shadow-orange-500/5 hover:shadow-xl hover:border-orange-400/30'}`}
                        style={{
                            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                            background: isDark
                                ? 'radial-gradient(at 50% 50%, rgba(249, 115, 22, 0.1) 0px, transparent 70%), linear-gradient(to bottom right, rgba(236, 72, 153, 0.05), transparent), rgba(255,255,255,0.05)'
                                : 'radial-gradient(at 50% 50%, rgba(249, 115, 22, 0.08) 0px, transparent 70%), linear-gradient(to bottom right, rgba(236, 72, 153, 0.05), transparent), rgba(255,255,255,0.7)',
                            ...(isDark && {
                                border: '1px solid rgba(255,255,255,0.1)'
                            })
                        }}>

                        <div className="absolute top-0 left-0 right-0 h-px"
                            style={{ background: `linear-gradient(90deg, transparent, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(249,115,22,0.3)'}, transparent)` }}>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 group-hover:scale-110 
                                ${isDark ? 'bg-orange-400/10 border-orange-400/20 text-orange-400 group-hover:bg-orange-400/20' : 'bg-orange-50 border-orange-100 text-orange-500 group-hover:bg-orange-100'}`}>
                                <span className="material-symbols-outlined text-3xl">forum</span>
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold mb-2 transition-colors ${isDark ? 'text-white group-hover:text-pink-200' : 'text-slate-900 group-hover:text-pink-600'}`}>Chat Interface</h3>
                                <p className={`text-sm leading-relaxed transition-colors ${isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-600 group-hover:text-slate-700'}`}>
                                    Interact with your data using natural language processing. Just ask questions and get immediate insights.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
            <footer className={`border-t mt-auto relative z-20 ${isDark ? 'border-white/5' : 'border-slate-200'}`}
                style={{ background: isDark ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)' }}>
                <div className="max-w-[1280px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500 text-xl">bolt</span>
                        <span className={`text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>© 2024 Analytica Inc.</span>
                    </div>
                    <div className={`flex gap-8 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <a className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-orange-500'}`} href="#">Privacy Policy</a>
                        <a className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-orange-500'}`} href="#">Terms of Service</a>
                        <a className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-orange-500'}`} href="#">Contact Support</a>
                    </div>
                    <div className="flex gap-4">
                        <a className={`transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-orange-500'}`} href="#">
                            <span className="material-symbols-outlined">alternate_email</span>
                        </a>
                        <a className={`transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-orange-500'}`} href="#">
                            <span className="material-symbols-outlined">hub</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
