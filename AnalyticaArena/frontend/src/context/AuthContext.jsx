import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState(null)

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token)
            // Fetch user profile
            authAPI.getCurrentUser()
                .then(res => setUser(res.data))
                .catch(() => { }) // silently fail
        } else {
            localStorage.removeItem('token')
            setUser(null)
        }
    }, [token])

    const login = (newToken) => {
        setToken(newToken)
    }

    const logout = () => {
        setToken(null)
        setUser(null)
    }

    const value = {
        token,
        user,
        setUser,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
