import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { uploadAPI, analysisAPI } from '../services/api'
import KPICard from '../components/KPICard'
import ChartCard from '../components/ChartCard'
import InsightPanel from '../components/InsightPanel'

export default function Dashboard() {
    const { datasetId } = useParams()
    const navigate = useNavigate()
    const [dataset, setDataset] = useState(null)
    const [analysis, setAnalysis] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => { loadData() }, [datasetId])

    const loadData = async () => {
        setIsLoading(true)
        setError('')
        try {
            const datasetResponse = await uploadAPI.getDatasetDetails(datasetId)
            setDataset(datasetResponse.data)
            try {
                const analysisResponse = await analysisAPI.getAnalysis(datasetId)
                setAnalysis(analysisResponse.data)
            } catch (err) {
                if (err.response?.status === 404) {
                    setError('This dataset has not been analyzed yet. Go to Upload page and click "Analyze Dataset".')
                } else { throw err }
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load data')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center scale-in">
                    <div className="spinner mx-auto mb-6"></div>
                    <p className="text-slate-700 dark:text-slate-300 text-lg font-semibold">Loading dashboard...</p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">Analyzing your data with AI</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="glass-card p-10 max-w-md text-center scale-in">
                    <span className="material-symbols-outlined text-6xl text-amber-500 block mb-4">warning</span>
                    <p className="text-slate-700 dark:text-slate-300 text-base mb-6">{error}</p>
                    <button onClick={() => navigate('/upload')} className="btn-primary">
                        ← Back to Upload
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 relative">

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 fade-in-up">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-3xl">table_chart</span>
                            <h1 className="text-3xl md:text-4xl font-bold text-gradient tracking-tight">{dataset?.filename}</h1>
                        </div>
                        <div className="flex items-center gap-2 mt-2 pl-1">
                            <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-accent/10 px-2 py-1 text-xs font-medium text-blue-600 dark:text-accent ring-1 ring-inset ring-blue-200 dark:ring-accent/20">
                                {dataset?.num_rows?.toLocaleString()} rows
                            </span>
                            <span className="text-slate-400 text-sm">×</span>
                            <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-accent/10 px-2 py-1 text-xs font-medium text-blue-600 dark:text-accent ring-1 ring-inset ring-blue-200 dark:ring-accent/20">
                                {dataset?.num_columns} cols
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/chat/${datasetId}`)}
                        className="flex items-center gap-2 h-11 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <span className="material-symbols-outlined text-[20px]">chat</span>
                        Chat with Data
                    </button>
                </div>

                {/* KPI Cards */}
                {analysis?.kpis && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <KPICard title="Total Records" value={analysis.kpis.total_records?.toLocaleString() || '0'} icon="database" color="emerald" trend="+12%" />
                        <KPICard title="Data Quality" value={`${analysis.quality_score}%`} icon="verified" color="blue" trend="High" />
                        <KPICard title="Completeness" value={`${analysis.kpis.data_completeness}%`} icon="donut_large" color="purple" trend="Perfect" />
                        <KPICard title="Missing Cells" value={analysis.kpis.missing_cells?.toLocaleString() || '0'} icon="warning" color="amber" trend="Attn" />
                    </div>
                )}

                {/* Main Dashboard Layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Charts */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">monitoring</span>
                                Visualizations
                            </h2>
                        </div>
                        {analysis?.charts && analysis.charts.length > 0 ? (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {analysis.charts.map((chart) => (
                                    <div key={chart.id} className="stagger-item">
                                        <ChartCard chart={chart} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-16 text-center text-slate-400 dark:text-slate-500 shadow-xl">
                                <span className="material-symbols-outlined text-6xl block mb-3 opacity-40">bar_chart</span>
                                <p>No charts generated</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Insights */}
                    <div className="w-full lg:w-1/3">
                        <InsightPanel insights={analysis?.insights || []} />
                    </div>
                </div>
            </div>
        </div>
    )
}
