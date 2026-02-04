import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Upload from './pages/Upload'
import Dashboard from './pages/Dashboard'
import ChatPage from './pages/ChatPage'
import Reports from './pages/Reports'
import Navbar from './components/Navbar'
import ParticleBackground from './components/ParticleBackground'

function PrivateRoute({ children }) {
    const { token } = useAuth()
    return token ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
    const { token } = useAuth()
    return !token ? children : <Navigate to="/upload" />
}

function App() {
    const { token } = useAuth()

    return (
        <Router>
            <ParticleBackground />
            {token && <Navbar />}
            <div className={token ? "pt-16" : ""}>
                <Routes>
                    <Route path="/login" element={
                        <PublicRoute><Login /></PublicRoute>
                    } />
                    <Route path="/register" element={
                        <PublicRoute><Register /></PublicRoute>
                    } />
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
                    <Route path="/" element={<Navigate to={token ? "/upload" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
