import { useParams, useNavigate } from 'react-router-dom'
import ChatBox from '../components/ChatBox'

export default function ChatPage() {
    const { datasetId } = useParams()
    const navigate = useNavigate()

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 flex items-center justify-between scale-in">
                    <div>
                        <h1 className="text-5xl font-bold text-white mb-3 flex items-center space-x-3">
                            <span className="glow">💬</span>
                            <span className="gradient-text">Chat with Your Data</span>
                        </h1>
                        <p className="text-slate-400 text-lg">Ask questions in natural language and get instant insights</p>
                    </div>
                    <button
                        onClick={() => navigate(`/dashboard/${datasetId}`)}
                        className="btn-secondary"
                    >
                        ← Dashboard
                    </button>
                </div>

                <div className="slide-in-left">
                    <ChatBox datasetId={datasetId} />
                </div>
            </div>
        </div>
    )
}
