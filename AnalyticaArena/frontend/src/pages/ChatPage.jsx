import { useParams, useNavigate } from 'react-router-dom'
import ChatBox from '../components/ChatBox'

export default function ChatPage() {
    const { datasetId } = useParams()
    const navigate = useNavigate()

    return (
        <div className="flex-1 flex flex-col relative">

            <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 fade-in-up">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient w-fit">Chat with Your Data</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mt-1">
                            Ask questions about your metrics and get instant AI-powered insights.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(`/dashboard/${datasetId}`)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0 w-fit"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        <span>Dashboard</span>
                    </button>
                </div>

                {/* Chat Component */}
                <div className="slide-in-left flex-1">
                    <ChatBox datasetId={datasetId} />
                </div>
            </div>
        </div>
    )
}
