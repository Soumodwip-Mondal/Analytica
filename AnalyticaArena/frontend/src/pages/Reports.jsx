import { useState, useEffect } from 'react'
import { uploadAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Reports() {
    const [datasets, setDatasets] = useState([])
    const navigate = useNavigate()

    useEffect(() => { loadDatasets() }, [])

    const loadDatasets = async () => {
        try {
            const response = await uploadAPI.getDatasets()
            setDatasets(response.data.filter(d => d.is_analyzed))
        } catch (err) {
            console.error('Error loading datasets:', err)
        }
    }

    return (
        <div className="flex-1 relative">

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 fade-in-up">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-gradient mb-2">Reports</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl">
                            Access and manage your AI-generated analytics insights and visualizations.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700 text-sm font-medium ring-2 ring-primary/10">
                            All Reports
                        </button>
                        <button className="px-4 py-2 rounded-full bg-transparent text-slate-500 border border-transparent hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 text-sm font-medium transition-all">
                            Analytics
                        </button>
                    </div>
                </div>

                {/* Report Cards */}
                {datasets.length > 0 ? (
                    <div className="flex flex-col gap-5 slide-in-left">
                        {/* Featured first card */}
                        {datasets.slice(0, 1).map((dataset) => (
                            <div key={dataset.id} className="group relative overflow-hidden glass-card border border-slate-200/60 dark:border-white/5 rounded-2xl p-6 md:p-8">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20 dark:ring-emerald-500/20">
                                                Analyzed
                                            </span>
                                            <span className="text-blue-500 text-xs font-semibold flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                {new Date(dataset.uploaded_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{dataset.filename}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                                            Comprehensive analysis with {dataset.num_rows?.toLocaleString()} rows and {dataset.num_columns} columns.
                                        </p>
                                        <div className="flex gap-8 text-sm">
                                            <div>
                                                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Rows</p>
                                                <p className="text-slate-900 dark:text-white font-bold">{dataset.num_rows?.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Columns</p>
                                                <p className="text-slate-900 dark:text-white font-bold">{dataset.num_columns}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex md:flex-col gap-3 shrink-0">
                                        <button
                                            onClick={() => navigate(`/dashboard/${dataset.id}`)}
                                            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm transition-all"
                                        >
                                            View Report
                                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                        </button>
                                        <button className="flex items-center justify-center gap-2 rounded-full bg-white dark:bg-slate-800 px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                            Download PDF
                                            <span className="material-symbols-outlined text-[16px]">download</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Secondary cards */}
                        {datasets.slice(1).map((dataset) => (
                            <div key={dataset.id} className="group relative overflow-hidden glass-card rounded-2xl hover:shadow-md transition-all">
                                <div className="flex flex-col md:flex-row p-6 gap-6 md:items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-blue-500 text-xs font-semibold flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                {new Date(dataset.uploaded_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{dataset.filename}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                                            {dataset.num_rows?.toLocaleString()} rows × {dataset.num_columns} columns
                                        </p>
                                        <div className="flex gap-6 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="size-2 rounded-full bg-primary"></div>
                                                <span className="text-slate-600 dark:text-slate-400 font-medium">AI Analyzed</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <button className="p-2 rounded-full text-slate-400 hover:text-primary hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                                        </button>
                                        <button className="hidden md:flex items-center justify-center rounded-full bg-white dark:bg-slate-800 px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-white/10 hover:bg-slate-50 hover:text-primary hover:ring-primary/20 transition-all">
                                            Download PDF
                                        </button>
                                        <button
                                            onClick={() => navigate(`/dashboard/${dataset.id}`)}
                                            className="flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/10 px-5 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-all"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-16 text-center scale-in">
                        <span className="material-symbols-outlined text-7xl text-slate-300 dark:text-slate-600 block mb-4">description</span>
                        <p className="text-2xl mb-2 text-slate-700 dark:text-slate-300 font-semibold">No analyzed datasets yet</p>
                        <p className="text-base text-slate-500 dark:text-slate-400 mb-6">Upload and analyze a dataset to generate your first report</p>
                        <button onClick={() => navigate('/upload')} className="btn-primary">
                            Upload Dataset
                        </button>
                    </div>
                )}

                {/* Pagination placeholder */}
                {datasets.length > 5 && (
                    <div className="mt-8 flex justify-center pb-8">
                        <nav className="inline-flex rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 p-1">
                            <button className="size-9 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="size-9 flex items-center justify-center text-white bg-primary rounded-lg font-bold text-sm">1</button>
                            <button className="size-9 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors font-medium text-sm">2</button>
                            <button className="size-9 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    )
}
