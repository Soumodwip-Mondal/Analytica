import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OAuthCallback() {
    const [searchParams] = useSearchParams()
    const { login } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const token = searchParams.get('token')
        if (token) {
            login(token)
            navigate('/upload')
        } else {
            console.error('No token found in OAuth callback')
            navigate('/login')
        }
    }, [searchParams, login, navigate])

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-white mb-2">Authenticating...</h2>
                <p className="text-slate-400">Please wait while we complete your sign-in.</p>
            </div>
        </div>
    )
}
