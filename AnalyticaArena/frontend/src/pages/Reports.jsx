import { useState, useEffect } from 'react'
import { uploadAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Reports() {
    const [datasets, setDatasets] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        loadDatasets()
    }, [])

    const loadDatasets = async () => {
        try {
            const response = await uploadAPI.getDatasets()
            setDatasets(response.data.filter(d => d.is_analyzed))
        } catch (err) {
            console.error('Error loading datasets:', err)
        }
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 scale-in">
                    <h1 className="text-5xl font-bold text-white mb-3 flex items-center space-x-3">
                        <span>📄</span>
                        <span className="gradient-text">Reports</span>
                    </h1>
                    <p className="text-slate-400 text-lg">View and download analysis reports for your datasets</p>
                </div>

                {datasets.length > 0 ? (
                    <div className="space-y-4 slide-in-left">
                        {datasets.map((dataset, index) => (
                            <div key={dataset.id} className="glass-card p-6 flex items-center justify-between hover:bg-slate-800/40 transition-all stagger-item group">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors flex items-center space-x-2">
                                        <span>📊</span>
                                        <span>{dataset.filename}</span>
                                    </h3>
                                    <p className="text-sm text-slate-400 mb-1">
                                        Uploaded on <span className="text-blue-400 font-semibold">{new Date(dataset.uploaded_at).toLocaleString()}</span>
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        <span className="text-blue-400 font-semibold">{dataset.num_rows.toLocaleString()}</span> rows ×
                                        <span className="text-purple-400 font-semibold"> {dataset.num_columns}</span> columns
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => navigate(`/dashboard/${dataset.id}`)}
                                        className="btn-primary"
                                    >
                                        📈 View Report
                                    </button>
                                    <button className="btn-secondary">
                                        ⬇️ Download PDF
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-16 text-center text-slate-400 scale-in">
                        <p className="text-6xl mb-4 opacity-50">📭</p>
                        <p className="text-2xl mb-2 text-slate-300">No analyzed datasets yet</p>
                        <p className="text-lg mb-6">Upload and analyze a dataset to generate your first report</p>
                        <button
                            onClick={() => navigate('/upload')}
                            className="btn-primary"
                        >
                            📁 Upload Dataset
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
