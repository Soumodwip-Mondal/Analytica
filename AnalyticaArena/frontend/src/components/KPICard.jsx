export default function KPICard({ title, value, icon, trend }) {
    return (
        <div className="glass-card p-6 scale-in hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">{title}</p>
                    <p className="text-4xl font-bold text-white mb-1 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        {value}
                    </p>
                    {trend && (
                        <p className={`text-sm mt-2 font-semibold ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
                        </p>
                    )}
                </div>
                <div className="text-5xl opacity-80 glow">{icon}</div>
            </div>
        </div>
    )
}
