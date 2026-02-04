export default function InsightPanel({ insights }) {
    if (!insights || insights.length === 0) {
        return (
            <div className="glass-card p-6">
                <p className="text-slate-400">No insights available</p>
            </div>
        )
    }

    const getImportanceColor = (importance) => {
        switch (importance) {
            case 'high': return 'border-rose-500 bg-rose-500/10'
            case 'medium': return 'border-amber-500 bg-amber-500/10'
            case 'low': return 'border-blue-500 bg-blue-500/10'
            default: return 'border-slate-500 bg-slate-500/10'
        }
    }

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'trend': return '📈'
            case 'pattern': return '🔍'
            case 'anomaly': return '⚠️'
            case 'recommendation': return '💡'
            default: return '📊'
        }
    }

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
                <span className="glow">🤖</span>
                <span className="gradient-text">AI Insights</span>
            </h2>
            {insights.map((insight, index) => (
                <div
                    key={index}
                    className={`glass-card p-6 border-l-4 ${getImportanceColor(insight.importance)} stagger-item hover:bg-slate-800/40 transition-all duration-300`}
                >
                    <div className="flex items-start space-x-4">
                        <span className="text-3xl flex-shrink-0">{getCategoryIcon(insight.category)}</span>
                        <div className="flex-1">
                            <h3 className="font-bold text-white text-lg mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                {insight.title}
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed mb-3">{insight.description}</p>
                            <div className="flex items-center space-x-2 text-xs">
                                <span className="px-3 py-1 bg-slate-800/60 rounded-full text-slate-300 border border-slate-700/50">
                                    {insight.category}
                                </span>
                                <span className={`px-3 py-1 rounded-full font-semibold ${insight.importance === 'high' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50' :
                                        insight.importance === 'medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' :
                                            'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                                    }`}>
                                    {insight.importance} priority
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
