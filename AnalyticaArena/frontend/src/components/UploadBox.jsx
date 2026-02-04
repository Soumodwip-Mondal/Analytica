import { useState, useRef } from 'react'

export default function UploadBox({ onUpload, isUploading }) {
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef(null)

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0])
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div
            className={`glass-card p-16 text-center cursor-pointer transition-all duration-300 neon-border ${dragActive ? 'border-blue-400 bg-blue-500/10 scale-105 shadow-2xl shadow-blue-500/50' : 'hover:border-blue-500/50 hover:bg-slate-800/40'
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept=".csv,.xlsx,.xls,.json"
                disabled={isUploading}
            />

            {isUploading ? (
                <div className="flex flex-col items-center space-y-6">
                    <div className="spinner"></div>
                    <div className="space-y-2">
                        <p className="text-slate-200 text-lg font-semibold">Uploading and analyzing...</p>
                        <p className="text-slate-400 text-sm">This may take a few moments</p>
                    </div>
                </div>
            ) : (
                <div className="scale-in">
                    <div className="mb-6 relative">
                        <svg className="mx-auto h-24 w-24 text-blue-400 glow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="absolute inset-0 blur-3xl bg-blue-500/20 -z-10"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                        Drop your dataset here
                    </h3>
                    <p className="text-slate-400 text-lg mb-3">
                        or click to browse
                    </p>
                    <div className="inline-flex items-center space-x-2 bg-slate-800/40 px-4 py-2 rounded-lg border border-slate-700/50 mt-4">
                        <span className="text-sm text-slate-300">Supported formats:</span>
                        <span className="text-sm font-semibold text-blue-400">CSV</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-sm font-semibold text-emerald-400">Excel</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-sm font-semibold text-purple-400">JSON</span>
                    </div>
                </div>
            )}
        </div>
    )
}
