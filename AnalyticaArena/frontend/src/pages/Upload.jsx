import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadAPI, analysisAPI } from '../services/api'
import UploadBox from '../components/UploadBox'
import DataPreview from '../components/DataPreview'

export default function Upload() {
    const [datasets, setDatasets] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [error, setError] = useState('')
    const [uploadedDataset, setUploadedDataset] = useState(null)
    const [previewData, setPreviewData] = useState(null)
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
        setUploadedDataset(null)
        setPreviewData(null)

        try {
            const uploadResponse = await uploadAPI.uploadFile(file)
            const dataset = uploadResponse.data
            setUploadedDataset(dataset)

            // Fetch preview data
            const previewResponse = await uploadAPI.getDatasetPreview(dataset.id)
            setPreviewData(previewResponse.data)

            // Reload datasets list
            await loadDatasets()
        } catch (err) {
            setError(err.response?.data?.detail?.errors?.join(', ') || err.response?.data?.detail || 'Upload failed')
        } finally {
            setIsUploading(false)
        }
    }

    const handleAnalyze = async () => {
        if (!uploadedDataset) return

        setIsAnalyzing(true)
        setError('')

        try {
            await analysisAPI.analyzeDataset(uploadedDataset.id)
            navigate(`/dashboard/${uploadedDataset.id}`)
        } catch (err) {
            setError(err.response?.data?.detail || 'Analysis failed')
            setIsAnalyzing(false)
        }
    }

    const handleDelete = async (datasetId) => {
        if (!confirm('Are you sure you want to delete this dataset?')) return

        try {
            await uploadAPI.deleteDataset(datasetId)
            // If deleting the currently previewed dataset, clear preview
            if (uploadedDataset?.id === datasetId) {
                setUploadedDataset(null)
                setPreviewData(null)
            }
            await loadDatasets()
        } catch (err) {
            alert('Failed to delete dataset')
        }
    }

    const [showRecentUploads, setShowRecentUploads] = useState(false)

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header with title + action buttons */}
                <div className="mb-10 fade-in-up">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Upload your data</h1>
                            <p className="text-slate-400 text-base">
                                Supported formats: CSV, JSON, Excel. Max file size 500MB.
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowRecentUploads(!showRecentUploads)}
                                className="flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-slate-700/50 bg-slate-800/40 text-slate-300 hover:text-white hover:bg-slate-700/50 hover:border-slate-600/50 transition-all text-sm font-medium"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Recent Uploads</span>
                            </button>
                            <button
                                className="flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-slate-700/50 bg-slate-800/40 text-slate-300 hover:text-white hover:bg-slate-700/50 hover:border-slate-600/50 transition-all text-sm font-medium"
                                onClick={() => alert('Supported formats:\n• CSV (.csv)\n• JSON (.json)\n• Excel (.xlsx, .xls)\n\nMax file size: 500MB\nMax rows: 100,000')}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                </svg>
                                <span>Help Guide</span>
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-rose-500/10 border border-rose-500/50 text-rose-300 px-6 py-4 rounded-xl fade-in-up flex items-center space-x-3">
                        <span className="text-2xl">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <div className="mb-8">
                    <UploadBox onUpload={handleUpload} isUploading={isUploading} />
                </div>

                {/* Uploaded file info card */}
                {uploadedDataset && (
                    <div className="mb-6 fade-in-up">
                        <div className="glass-card p-5 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                                    <span className="text-2xl">📄</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold text-lg">{uploadedDataset.filename}</h4>
                                    <p className="text-sm text-slate-400">
                                        <span className="text-blue-400 font-semibold">{uploadedDataset.num_rows?.toLocaleString()}</span> rows ×
                                        <span className="text-purple-400 font-semibold"> {uploadedDataset.num_columns}</span> columns
                                    </p>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
                                ✓ Ready for review
                            </span>
                        </div>
                    </div>
                )}

                {/* Data Preview Table */}
                {previewData && (
                    <div className="mb-8 fade-in-up">
                        <DataPreview preview={previewData} />
                    </div>
                )}

                {/* Analyze Dataset Button */}
                {uploadedDataset && previewData && (
                    <div className="mb-16 flex justify-end fade-in-up">
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className={`btn-primary px-8 py-4 text-lg font-semibold flex items-center space-x-3 ${isAnalyzing ? 'opacity-70 cursor-wait' : 'hover:scale-105'
                                } transition-all duration-300`}
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="spinner w-5 h-5"></div>
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <span>🔍</span>
                                    <span>Analyze Dataset</span>
                                </>
                            )}
                        </button>
                    </div>
                )}

                {(datasets.length > 0 && (showRecentUploads || !uploadedDataset)) && (
                    <div className="fade-in-up">
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

                {datasets.length === 0 && !isUploading && !uploadedDataset && (
                    <div className="text-center text-slate-400 py-20 fade-in-up">
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
