import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import Upload from './pages/Upload'
import Dashboard from './pages/Dashboard'
import ChatPage from './pages/ChatPage'
import Reports from './pages/Reports'
import LandingPage from './pages/LandingPage'
import Navbar from './components/Navbar'
import LoginModal from './components/LoginModal'
import RegisterModal from './components/RegisterModal'

function PrivateRoute({ children }) {
    const { token } = useAuth()
    return token ? children : <Navigate to="/" />
}

function LandingRoute() {
    const { token } = useAuth()
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)

    if (token) {
        return <Navigate to="/upload" />
    }

    return (
        <>
            <LandingPage
                onOpenLogin={() => setShowLoginModal(true)}
                onOpenRegister={() => setShowRegisterModal(true)}
            />
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSwitchToRegister={() => {
                    setShowLoginModal(false)
                    setShowRegisterModal(true)
                }}
            />
            <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSwitchToLogin={() => {
                    setShowRegisterModal(false)
                    setShowLoginModal(true)
                }}
            />
        </>
    )
}

import ThemeBackground from './components/ThemeBackground'

function App() {
    const { token } = useAuth()

    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ThemeBackground />
            {token && <Navbar />}
            <div className={`min-h-screen relative overflow-x-hidden flex flex-col transition-colors duration-300 fade-in-up ${token ? "pt-16" : ""}`}>

                <Routes>
                    <Route path="/upload" element={
                        <PrivateRoute><Upload /></PrivateRoute>
                    } />
                    <Route path="/dashboard/:datasetId" element={
                        <PrivateRoute><Dashboard /></PrivateRoute>
                    } />
                    <Route path="/chat/:datasetId" element={
                        <PrivateRoute><ChatPage /></PrivateRoute>
                    } />
                    <Route path="/reports" element={
                        <PrivateRoute><Reports /></PrivateRoute>
                    } />
                    <Route path="/" element={<LandingRoute />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
