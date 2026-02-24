export default function DataPreview({ preview }) {
    if (!preview || !preview.rows || !preview.columns) return null

    return (
        <div className="w-full fade-in-up">
            {/* Section header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500">table_chart</span>
                    Data Preview
                </h2>
                <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-hidden glass-card shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                        <thead className="bg-slate-50 dark:bg-white/5 text-xs uppercase font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-white/10">
                            <tr>
                                {preview.columns.map((col) => (
                                    <th key={col} className="px-6 py-4" scope="col">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {preview.rows.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={`hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${rowIndex === preview.rows.length - 1 ? 'opacity-60' : ''}`}
                                >
                                    {preview.columns.map((col) => {
                                        const val = row[col]
                                        const isNull = val === null || val === undefined
                                        // Detect status-like columns for badge treatment
                                        const strVal = String(val ?? '')
                                        const isStatus = ['completed', 'pending', 'failed', 'success', 'error', 'active', 'inactive'].includes(strVal.toLowerCase())
                                        let badgeClass = ''
                                        if (isStatus) {
                                            if (['completed', 'success', 'active'].includes(strVal.toLowerCase())) badgeClass = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            else if (['pending'].includes(strVal.toLowerCase())) badgeClass = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            else badgeClass = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }
                                        return (
                                            <td key={col} className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200 max-w-[200px] truncate" title={strVal}>
                                                {isNull ? (
                                                    <span className="text-slate-400 italic text-xs">null</span>
                                                ) : isStatus ? (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${badgeClass}`}>{strVal}</span>
                                                ) : (
                                                    strVal
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Footer */}
                <div className="px-6 py-3 bg-slate-50/50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        Showing {preview.rows.length} of {preview.total_rows?.toLocaleString()} rows
                    </span>
                    <button className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">
                        View Full Table
                    </button>
                </div>
            </div>
        </div>
    )
}
