import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function About() {
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
        <div className="flex flex-col min-h-screen">
            {/* ── HEADER ── */}
            <header className="w-full z-50 fixed top-0 transition-all duration-300"
                style={{
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    background: isDark ? 'rgba(15, 23, 42, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                    borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
                }}>
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 sm:gap-3">
                        <div className="flex w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 items-center justify-center text-white shadow-lg shadow-pink-500/20">
                            <span className="material-symbols-outlined text-xl" style={{ fontSize: '18px' }}>bolt</span>
                        </div>
                        <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Analytica</span>
                    </Link>

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
                        <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                            style={{
                                background: 'linear-gradient(to right, #f97316, #db2777)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                            Our Mission
                        </h1>
                        <p className={`text-xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            At Analytica, we believe that data is the lifeblood of modern decision-making.
                            Our mission is to democratize advanced data science tools, making it easy for
                            teams of all sizes to uncover insights and drive growth.
                        </p>
                    </div>

                    <div className={`p-8 rounded-3xl border mb-16 ${isDark ? 'bg-slate-800/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Why We Built Analytica</h2>
                        <div className={`space-y-6 text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            <p>
                                Traditional analytics tools are often too complex, too slow, or too expensive.
                                We saw a gap in the market for a platform that combines the power of enterprise-grade
                                machine learning with the simplicity of a modern web application.
                            </p>
                            <p>
                                Since our founding in 2024, we've focused on one thing: helping our users
                                understand their data better than ever before. Whether you're a startup
                                looking for your first growth signals or an enterprise optimizing global
                                operations, Analytica is built for you.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className={`p-8 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Innovation</h3>
                            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                We constantly push the boundaries of what's possible with AI and data visualization.
                            </p>
                        </div>
                        <div className={`p-8 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Transparency</h3>
                            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                We believe in explainable AI. You should always know why our models make the predictions they do.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className={`border-t py-12 ${isDark ? 'border-white/5 text-slate-500' : 'border-slate-200 text-slate-600'}`}>
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm">© 2024 Analytica Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
