import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadAPI, analysisAPI } from '../services/api'
import UploadBox from '../components/UploadBox'

export default function Upload() {
    const [datasets, setDatasets] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        loadDatasets()
    }, [])

    const loadDatasets = async () => {
        try {
            const response = await uploadAPI.getDatasets()
            setDatasets(response.data)
        } catch (err) {
            console.error('Error loading datasets:', err)
        }
    }

    const handleUpload = async (file) => {
        setError('')
        setIsUploading(true)

        try {
            const uploadResponse = await uploadAPI.uploadFile(file)
            const datasetId = uploadResponse.data.id

            // Automatically trigger analysis
            await analysisAPI.analyzeDataset(datasetId)

            // Reload datasets
            await loadDatasets()

            // Navigate to dashboard
            navigate(`/dashboard/${datasetId}`)
        } catch (err) {
            setError(err.response?.data?.detail?.errors?.join(', ') || err.response?.data?.detail || 'Upload failed')
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async (datasetId) => {
        if (!confirm('Are you sure you want to delete this dataset?')) return

        try {
            await uploadAPI.deleteDataset(datasetId)
            await loadDatasets()
        } catch (err) {
            alert('Failed to delete dataset')
        }
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12 scale-in">
                    <h1 className="text-5xl font-bold text-white mb-3 gradient-text">Upload Dataset</h1>
                    <p className="text-slate-400 text-lg">Upload your data to get AI-powered insights and visualizations</p>
                </div>

                {error && (
                    <div className="mb-6 bg-rose-500/10 border border-rose-500/50 text-rose-300 px-6 py-4 rounded-xl slide-in-left flex items-center space-x-3">
                        <span className="text-2xl">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <div className="mb-16">
                    <UploadBox onUpload={handleUpload} isUploading={isUploading} />
                </div>

                {datasets.length > 0 && (
                    <div className="slide-in-left">
                        <h2 className="text-3xl font-bold text-white mb-8 flex items-center space-x-3">
                            <span>📁</span>
                            <span className="gradient-text">Your Datasets</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {datasets.map((dataset, index) => (
                                <div key={dataset.id} className={`glass-card p-6 card-hover stagger-item group relative overflow-hidden`}>
                                    {/* Glow effect on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 -z-10"></div>

                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white text-lg mb-2 truncate group-hover:text-blue-300 transition-colors">
                                                📊 {dataset.filename}
                                            </h3>
                                            <p className="text-sm text-slate-400">
                                                <span className="font-semibold text-blue-400">{dataset.num_rows.toLocaleString()}</span> rows ×
                                                <span className="font-semibold text-purple-400"> {dataset.num_columns}</span> columns
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(dataset.id)
                                            }}
                                            className="text-rose-400 hover:text-rose-300 transition p-2 hover:bg-rose-500/10 rounded-lg"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center space-x-2 mb-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${dataset.is_analyzed
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                                            }`}>
                                            {dataset.is_analyzed ? '✓ Analyzed' : '⏳ Pending'}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {new Date(dataset.uploaded_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => navigate(`/dashboard/${dataset.id}`)}
                                            className="flex-1 btn-primary text-sm py-2.5"
                                        >
                                            📈 Dashboard
                                        </button>
                                        <button
                                            onClick={() => navigate(`/chat/${dataset.id}`)}
                                            className="flex-1 btn-secondary text-sm py-2.5"
                                        >
                                            💬 Chat
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {datasets.length === 0 && !isUploading && (
                    <div className="text-center text-slate-400 py-20 scale-in">
                        <div className="mb-6">
                            <span className="text-6xl opacity-50">📂</span>
                        </div>
                        <p className="text-2xl mb-2 text-slate-300">No datasets uploaded yet</p>
                        <p className="text-lg">Upload your first dataset to get started with AI-powered analytics</p>
                    </div>
                )}
            </div>
        </div>
    )
}
