import { useState, useRef, useEffect } from 'react'
import { chatAPI } from '../services/api'

export default function ChatBox({ datasetId }) {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        loadChatHistory()
    }, [datasetId])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const loadChatHistory = async () => {
        try {
            const response = await chatAPI.getChatHistory(datasetId)
            if (response.data.messages) {
                setMessages(response.data.messages)
            }
        } catch (error) {
            console.error('Error loading chat history:', error)
        }
    }

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage = {
            role: 'user',
            content: input,
            timestamp: new Date().toISOString()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const response = await chatAPI.sendMessage(datasetId, input)

            const assistantMessage = {
                role: 'assistant',
                content: response.data.message,
                timestamp: new Date().toISOString(),
                data: response.data.data,
                chart_config: response.data.chart_config
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error processing your query.',
                timestamp: new Date().toISOString()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="glass-card flex flex-col h-[600px] neon-border">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-slate-400 mt-16 scale-in">
                        <p className="text-5xl mb-4 glow">💬</p>
                        <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-2">Ask me anything about your data!</p>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-8">I can answer questions, generate insights, and create visualizations</p>
                        <div className="space-y-3">
                            <p className="text-xs text-slate-600 uppercase tracking-wider">Try asking:</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {[
                                    "What is the average value?",
                                    "Show top 5 categories",
                                    "Find any outliers",
                                    "What are the trends?",
                                    "Calculate the median",
                                    "Group by category"
                                ].map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(suggestion)}
                                        className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/50 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700/50 hover:border-orange-500/50 hover:text-orange-500 shadow-sm"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} slide-in-${msg.role === 'user' ? 'right' : 'left'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user'
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/20'
                                    : 'glass-card border border-slate-700/50'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                                {msg.data && (
                                    <div className="mt-3 p-3 bg-black/30 rounded-lg text-xs border border-slate-700/30">
                                        <pre className="overflow-x-auto text-slate-300">{JSON.stringify(msg.data, null, 2)}</pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start slide-in-left">
                        <div className="glass-card rounded-2xl p-4 border border-slate-700/50">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-700/50 p-4 bg-slate-900/30 backdrop-blur">
                <div className="flex space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a question about your data..."
                        className="flex-1 input-field"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-8"
                    >
                        {isLoading ? '...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    )
}
