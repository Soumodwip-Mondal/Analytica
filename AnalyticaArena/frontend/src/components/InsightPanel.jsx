export default function InsightPanel({ insights }) {
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'trend': return 'north_east'
            case 'pattern': return 'lightbulb'
            case 'anomaly': return 'warning'
            case 'recommendation': return 'lightbulb'
            default: return 'auto_awesome'
        }
    }

    const getImportanceStyle = (importance) => {
        switch (importance) {
            case 'high': return { icon: 'text-rose-500 dark:text-rose-400', bg: 'border-rose-200 dark:border-rose-500/30' }
            case 'medium': return { icon: 'text-amber-500 dark:text-amber-400', bg: 'border-amber-200 dark:border-amber-500/30' }
            case 'low': return { icon: 'text-blue-500 dark:text-blue-400', bg: 'border-blue-200 dark:border-blue-500/30' }
            default: return { icon: 'text-purple-500 dark:text-purple-400', bg: 'border-slate-200 dark:border-slate-500/30' }
        }
    }

    return (
        <div className="glass-card h-full flex flex-col p-6 border-t-4 border-t-primary/60 dark:border-t-primary/50">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <span className="material-symbols-outlined text-white text-xl">auto_awesome</span>
                </div>
                <div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg">AI Insights</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">Automated analysis & trends</p>
                </div>
            </div>

            {/* Insights list */}
            {insights && insights.length > 0 ? (
                <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                    {insights.map((insight, index) => {
                        const style = getImportanceStyle(insight.importance)
                        return (
                            <div
                                key={index}
                                className={`p-4 rounded-xl border ${style.bg} hover:border-primary/30 transition-colors stagger-item`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className={`material-symbols-outlined mt-0.5 text-sm ${style.icon}`}>
                                        {getCategoryIcon(insight.category)}
                                    </span>
                                    <div>
                                        <h4 className="text-slate-800 dark:text-slate-200 text-sm font-semibold mb-1">{insight.title}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{insight.description}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 capitalize">
                                                {insight.category}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${insight.importance === 'high' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-300' :
                                                insight.importance === 'medium' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300' :
                                                    'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300'}`}>
                                                {insight.importance} priority
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-center">
                    <div>
                        <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 block mb-3">auto_awesome</span>
                        <p className="text-slate-500 dark:text-slate-500 text-sm">No insights available</p>
                    </div>
                </div>
            )}

            {/* Footer button */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                <button className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-white font-medium transition-colors flex items-center justify-center gap-2">
                    Generate Full Report
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </div>
    )
}
