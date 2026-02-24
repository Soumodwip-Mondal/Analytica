export default function KPICard({ title, value, icon, color = 'orange', trend }) {
    const colorMap = {
        emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-500 dark:text-emerald-400', trend: 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' },
        blue: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-500 dark:text-blue-400', trend: 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10' },
        purple: { bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-500 dark:text-purple-400', trend: 'text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10' },
        amber: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-500 dark:text-amber-400', trend: 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10' },
        orange: { bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-primary', trend: 'text-primary bg-orange-50 dark:bg-orange-500/10' },
    }
    const c = colorMap[color] || colorMap.orange

    return (
        <div className="glass-card p-5 group hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${c.bg} ${c.text}`}>
                    <span className="material-symbols-outlined text-[22px]">{icon}</span>
                </div>
                {trend && (
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${c.trend}`}>{trend}</span>
                )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
            <h3 className={`text-2xl font-bold text-slate-900 dark:text-white group-hover:${c.text.split(' ')[0]} transition-colors`}>{value}</h3>
        </div>
    )
}
