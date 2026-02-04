import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
    baseURL: API_BASE_URL,
})

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Auth endpoints
export const authAPI = {
    register: (data) => api.post('/api/auth/register', data),
    login: (email, password) => {
        const formData = new FormData()
        formData.append('username', email)
        formData.append('password', password)
        return api.post('/api/auth/login', formData)
    },
    getCurrentUser: () => api.get('/api/auth/me'),
}

// Upload endpoints
export const uploadAPI = {
    uploadFile: (file) => {
        const formData = new FormData()
        formData.append('file', file)
        return api.post('/api/upload/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    getDatasets: () => api.get('/api/upload/datasets'),
    getDatasetDetails: (datasetId) => api.get(`/api/upload/dataset/${datasetId}`),
    deleteDataset: (datasetId) => api.delete(`/api/upload/dataset/${datasetId}`),
}

// Analysis endpoints
export const analysisAPI = {
    analyzeDataset: (datasetId) => api.post(`/api/analysis/analyze/${datasetId}`),
    getAnalysis: (datasetId) => api.get(`/api/analysis/${datasetId}`),
    getQuality: (datasetId) => api.get(`/api/analysis/${datasetId}/quality`),
    getInsights: (datasetId) => api.get(`/api/analysis/${datasetId}/insights`),
}

// Chat endpoints
export const chatAPI = {
    sendMessage: (datasetId, message) =>
        api.post('/api/chat/query', { dataset_id: datasetId, message }),
    getChatHistory: (datasetId) => api.get(`/api/chat/history/${datasetId}`),
    clearHistory: (datasetId) => api.delete(`/api/chat/history/${datasetId}`),
}

export default api
