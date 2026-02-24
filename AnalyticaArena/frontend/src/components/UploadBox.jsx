import { useState, useRef } from 'react'

export default function UploadBox({ onUpload, isUploading }) {
    const [dragActive, setDragActive] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(null) // { filename, progress }
    const fileInputRef = useRef(null)

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
        else if (e.type === 'dragleave') setDragActive(false)
    }

    const simulateProgress = (file) => {
        setUploadProgress({ filename: file.name, size: (file.size / 1024 / 1024).toFixed(1), progress: 0 })
        let p = 0
        const interval = setInterval(() => {
            p += Math.random() * 15
            if (p >= 95) {
                clearInterval(interval)
                setUploadProgress(null)
                onUpload(file)
            } else {
                setUploadProgress({ filename: file.name, size: (file.size / 1024 / 1024).toFixed(1), progress: Math.floor(p) })
            }
        }, 200)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) simulateProgress(e.dataTransfer.files[0])
    }

    const handleChange = (e) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) simulateProgress(e.target.files[0])
    }

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Drop zone */}
            <div className="relative group cursor-pointer w-full">
                {/* Ambient glow backdrop */}
                <div className={`absolute -inset-2 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-orange-500/10 rounded-[2.5rem] blur-2xl transition-all duration-1000 opacity-60 group-hover:opacity-100 group-hover:scale-105`}></div>

                <div
                    className={`relative w-full h-72 upload-zone-glass flex flex-col items-center justify-center transition-all duration-500 p-8 ${dragActive ? 'border-orange-500/50 bg-orange-500/10 scale-[1.01]' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleChange}
                        accept=".csv,.xlsx,.xls,.json"
                        disabled={isUploading || uploadProgress !== null}
                    />

                    {isUploading ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="spinner"></div>
                            <p className="text-slate-700 dark:text-slate-200 text-lg font-semibold">Processing dataset...</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-orange-500/5 dark:bg-orange-500/10 p-5 rounded-3xl mb-4 group-hover:scale-110 group-hover:bg-orange-500/10 transition-all duration-500">
                                <span className="material-symbols-outlined text-orange-500 text-5xl">cloud_upload</span>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Drop your CSV/Excel file here</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">or click to browse from your computer</p>
                            <button
                                type="button"
                                className="px-6 py-2.5 bg-white dark:bg-[#171717] border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:border-orange-500 dark:hover:border-orange-500 text-slate-700 dark:text-slate-300 transition-colors shadow-sm pointer-events-none"
                            >
                                Browse Files
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Progress bar — shown while simulating upload */}
            {uploadProgress && (
                <div className="glass-card p-5 shadow-lg fade-in-up">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-green-500 text-xl">description</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-900 dark:text-white">{uploadProgress.filename}</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">{uploadProgress.size} MB • Uploading...</span>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-orange-500">{uploadProgress.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-orange-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${uploadProgress.progress}%`, boxShadow: '0 0 10px rgba(249,115,22,0.5)' }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    )
}
