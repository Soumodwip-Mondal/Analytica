import { useState, useEffect } from 'react'

export default function ThemeBackground() {
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

    return (
        <>
            {/* Ambient background glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] ${isDark ? 'bg-orange-500/20' : 'bg-orange-500/30'}`}></div>
                <div className={`absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[100px] ${isDark ? 'bg-pink-500/15' : 'bg-pink-500/20'}`}></div>
                <div className={`absolute bottom-0 left-[20%] w-[60%] h-[30%] rounded-full blur-[150px] ${isDark ? 'bg-orange-500/10' : 'bg-orange-500/20'}`}></div>
            </div>

            {/* Noise texture and radial gradient */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_center,_transparent_0%,_#0f172a_100%)] opacity-70' : 'bg-[radial-gradient(circle_at_center,_transparent_0%,_#F8FAFC_100%)] opacity-40'}`}></div>
                <div className={`h-full w-full pointer-events-none ${isDark ? 'opacity-[0.02]' : 'opacity-[0.04]'}`} style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAosDzrenwPz7lZNuNp9YycMaxKfV40mceVHjDWnm629sdyizVSLecqCC7yoO7D3qQKoAFLhAtLUA7pGQdUFfrFXrDzIKO3Ompk71-nMtHDO3Vfaqk4Fci34D3NQXDBezvNEwNjk6kKeSgplHsdxPUWH-5DAZm4lywFPmF6jKs9McJTdxGNn5jZOoEK3LcJ5IYgvQGRrEOqtnVk6VVjbJdT7y2U-XaSVEUfbxQDVTsPxFJizZB0vu1ML0zeUJ-xyZHo0gAK0g2NEjnt')" }}></div>
            </div>
        </>
    )
}
