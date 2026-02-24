export default function DataPreview({ preview }) {
    if (!preview || !preview.rows || !preview.columns) return null

    return (
        <div className="glass-card p-6 fade-in-up">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                    <span>📋</span>
                    <span className="gradient-text">Data Preview</span>
                </h3>
                <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-700/50">
                    Showing {preview.rows.length} of {preview.total_rows?.toLocaleString()} rows
                </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-700/50">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-800/60 border-b border-slate-700/50">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                #
                            </th>
                            {preview.columns.map((col) => (
                                <th
                                    key={col}
                                    className="px-4 py-3 text-left text-xs font-semibold text-blue-400 uppercase tracking-wider whitespace-nowrap"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {preview.rows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`border-b border-slate-700/30 transition-colors hover:bg-slate-800/40 ${rowIndex % 2 === 0 ? 'bg-slate-900/20' : 'bg-slate-800/10'
                                    }`}
                            >
                                <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                                    {rowIndex + 1}
                                </td>
                                {preview.columns.map((col) => (
                                    <td
                                        key={col}
                                        className="px-4 py-3 text-slate-300 whitespace-nowrap max-w-[200px] truncate"
                                        title={String(row[col] ?? '')}
                                    >
                                        {row[col] === null || row[col] === undefined ? (
                                            <span className="text-slate-600 italic">null</span>
                                        ) : (
                                            String(row[col])
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
