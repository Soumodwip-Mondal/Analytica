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
    const [showRecentUploads, setShowRecentUploads] = useState(false)
    const navigate = useNavigate()

    useEffect(() => { loadDatasets() }, [])

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
            const previewResponse = await uploadAPI.getDatasetPreview(dataset.id)
            setPreviewData(previewResponse.data)
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
            if (uploadedDataset?.id === datasetId) { setUploadedDataset(null); setPreviewData(null) }
            await loadDatasets()
        } catch (err) {
            alert('Failed to delete dataset')
        }
    }

    return (
        <div className="flex-1 relative">

            {/* Main content */}
            <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col items-center">

                {/* Page heading */}
                <div className="text-center mb-12 fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                        Upload Your Dataset
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Transform your raw data into actionable insights. Supports .csv, .xls, and .json formats.
                    </p>
                </div>

                {/* Error banner */}
                {error && (
                    <div className="w-full max-w-3xl mb-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-300 px-5 py-4 rounded-xl flex items-center gap-3 fade-in-up">
                        <span className="material-symbols-outlined text-xl shrink-0">warning</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Upload box + progress bar */}
                <div className="w-full max-w-3xl mb-12">
                    <UploadBox onUpload={handleUpload} isUploading={isUploading} />
                </div>

                {/* Uploaded file summary (after successful upload, before analysis) */}
                {uploadedDataset && (
                    <div className="w-full max-w-3xl mb-6 fade-in-up">
                        <div className="glass-card p-5 flex items-center justify-between shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-emerald-500">description</span>
                                </div>
                                <div>
                                    <h4 className="text-slate-900 dark:text-white font-semibold">{uploadedDataset.filename}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        <span className="text-blue-500 font-semibold">{uploadedDataset.num_rows?.toLocaleString()}</span> rows ×
                                        <span className="text-purple-500 font-semibold"> {uploadedDataset.num_columns}</span> columns
                                    </p>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                                ✓ Ready for review
                            </span>
                        </div>
                    </div>
                )}

                {/* Data Preview Table */}
                {previewData && (
                    <div className="w-full max-w-3xl mb-10">
                        <DataPreview preview={previewData} />
                    </div>
                )}

                {/* Run Analysis button */}
                {uploadedDataset && previewData && (
                    <div className="w-full flex flex-col items-center gap-3 mb-16 fade-in-up">
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-orange-500 rounded-xl overflow-hidden transition-all hover:bg-orange-600 hover:scale-105 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-wait disabled:hover:scale-100"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isAnalyzing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]">analytics</span>
                                        <span>Run Analysis</span>
                                    </>
                                )}
                            </span>
                            {/* Shimmer sweep */}
                            {!isAnalyzing && (
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                            )}
                        </button>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                            Data validated and ready for processing
                        </p>
                    </div>
                )}

                {/* Recent datasets */}
                {(datasets.length > 0 && (showRecentUploads || !uploadedDataset)) && (
                    <div className="w-full max-w-3xl fade-in-up">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-orange-500">folder_open</span>
                            Your Datasets
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {datasets.map((dataset) => (
                                <div key={dataset.id} className="group glass-card p-5 transition-all shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 truncate group-hover:text-orange-500 transition-colors">{dataset.filename}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                <span className="text-blue-500 font-semibold">{dataset.num_rows?.toLocaleString()}</span> rows ×
                                                <span className="text-purple-500 font-semibold"> {dataset.num_columns}</span> cols
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(dataset.id) }}
                                            className="text-slate-400 hover:text-rose-500 transition p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg ml-2"
                                        >
                                            <span className="material-symbols-outlined text-base">delete_outline</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${dataset.is_analyzed
                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'}`}>
                                            {dataset.is_analyzed ? '✓ Analyzed' : '⏳ Pending'}
                                        </span>
                                        <span className="text-xs text-slate-400">{new Date(dataset.uploaded_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => navigate(`/dashboard/${dataset.id}`)} className="flex-1 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors">
                                            Dashboard
                                        </button>
                                        <button onClick={() => navigate(`/chat/${dataset.id}`)} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors">
                                            Chat
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {datasets.length === 0 && !isUploading && !uploadedDataset && (
                    <div className="text-center py-16 fade-in-up">
                        <span className="material-symbols-outlined text-7xl text-slate-300 dark:text-slate-700 block mb-4">folder_open</span>
                        <p className="text-xl mb-2 text-slate-700 dark:text-slate-300 font-semibold">No datasets uploaded yet</p>
                        <p className="text-base text-slate-500 dark:text-slate-500">Drop a file above to get started with AI-powered analytics</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="relative z-10 mt-4 border-t border-slate-200 dark:border-white/10 py-8 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    <p>© 2024 Analytica AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
