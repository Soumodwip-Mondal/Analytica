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

    useEffect(() => {
        loadData()
    }, [datasetId])

    const loadData = async () => {
        setIsLoading(true)
        setError('')

        try {
            // Load dataset details
            const datasetResponse = await uploadAPI.getDatasetDetails(datasetId)
            setDataset(datasetResponse.data)

            // Load analysis
            try {
                const analysisResponse = await analysisAPI.getAnalysis(datasetId)
                setAnalysis(analysisResponse.data)
            } catch (err) {
                if (err.response?.status === 404) {
                    // Analysis not found, trigger it
                    const newAnalysis = await analysisAPI.analyzeDataset(datasetId)
                    setAnalysis(newAnalysis.data)
                } else {
                    throw err
                }
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
                    <p className="text-slate-300 text-lg font-semibold">Loading dashboard...</p>
                    <p className="text-slate-500 text-sm mt-2">Analyzing your data with AI</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="glass-card p-10 max-w-md text-center scale-in">
                    <span className="text-6xl mb-4 block">⚠️</span>
                    <p className="text-rose-400 text-lg mb-6">{error}</p>
                    <button onClick={() => navigate('/upload')} className="btn-primary">
                        ← Back to Upload
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10 flex items-center justify-between scale-in">
                    <div>
                        <h1 className="text-5xl font-bold text-white mb-3 gradient-text flex items-center space-x-3">
                            <span>📊</span>
                            <span>{dataset?.filename}</span>
                        </h1>
                        <p className="text-slate-400 text-lg">
                            <span className="text-blue-400 font-semibold">{dataset?.num_rows?.toLocaleString()}</span> rows ×
                            <span className="text-purple-400 font-semibold"> {dataset?.num_columns}</span> columns
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(`/chat/${datasetId}`)}
                        className="btn-primary"
                    >
                        💬 Chat with Data
                    </button>
                </div>

                {/* KPIs */}
                {analysis?.kpis && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <KPICard
                            title="Total Records"
                            value={analysis.kpis.total_records?.toLocaleString() || '0'}
                            icon="📊"
                        />
                        <KPICard
                            title="Data Quality"
                            value={`${analysis.quality_score}%`}
                            icon="✨"
                        />
                        <KPICard
                            title="Completeness"
                            value={`${analysis.kpis.data_completeness}%`}
                            icon="📈"
                        />
                        <KPICard
                            title="Missing Cells"
                            value={analysis.kpis.missing_cells?.toLocaleString() || '0'}
                            icon="⚠️"
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Charts */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
                            <span>📈</span>
                            <span className="gradient-text">Visualizations</span>
                        </h2>
                        {analysis?.charts && analysis.charts.length > 0 ? (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {analysis.charts.map((chart, index) => (
                                    <div key={chart.id} className="stagger-item">
                                        <ChartCard chart={chart} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center text-slate-400">
                                <span className="text-5xl mb-3 block opacity-50">📉</span>
                                <p>No charts generated</p>
                            </div>
                        )}
                    </div>

                    {/* Insights */}
                    <div className="lg:col-span-1">
                        <InsightPanel insights={analysis?.insights || []} />
                    </div>
                </div>
            </div>
        </div>
    )
}
