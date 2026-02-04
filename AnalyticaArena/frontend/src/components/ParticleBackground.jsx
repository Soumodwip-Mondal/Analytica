export default function ParticleBackground() {
    return (
        <div className="particles pointer-events-none">
            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 4 + 2}px`,
                        height: `${Math.random() * 4 + 2}px`,
                        animationDelay: `${Math.random() * 20}s`,
                        animationDuration: `${Math.random() * 10 + 15}s`
                    }}
                />
            ))}
        </div>
    )
}
