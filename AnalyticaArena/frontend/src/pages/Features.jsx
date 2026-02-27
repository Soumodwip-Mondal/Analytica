import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Features() {
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

    const features = [
        {
            title: "Advanced Data Processing",
            description: "Handle massive datasets with our optimized processing engine. Clean, transform, and prepare your data in seconds.",
            icon: "database"
        },
        {
            title: "AI-Powered Insights",
            description: "Our proprietary machine learning models automatically identify trends, anomalies, and opportunities in your data.",
            icon: "auto_awesome"
        },
        {
            title: "Interactive Dashboards",
            description: "Build stunning, real-time visualizations that make complex data easy to understand for everyone on your team.",
            icon: "dashboard"
        },
        {
            title: "Natural Language Queries",
            description: "Ask questions like 'What was our best performing region last quarter?' and get immediate, visual answers.",
            icon: "chat"
        },
        {
            title: "Predictive Analytics",
            description: "Don't just see what happened—see what's coming. Forecast future trends with high accuracy using our AI models.",
            icon: "trending_up"
        },
        {
            title: "Enterprise Security",
            description: "Your data is protected with military-grade encryption and granular access controls. Privacy is our top priority.",
            icon: "security"
        }
    ]

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
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                            style={{
                                background: 'linear-gradient(to right, #f97316, #db2777)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                            Powerful Features for Data-Driven Teams
                        </h1>
                        <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Everything you need to transform raw data into actionable intelligence.
                            Built with cutting-edge AI and designed for maximum performance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 ${isDark ? 'bg-slate-800/50 border-white/10 hover:border-orange-500/30' : 'bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-500/30'}`}>
                                <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center ${isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
                                    <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                                </div>
                                <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
                                <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
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
