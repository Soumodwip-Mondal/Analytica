# ⚡ Analytica - GenAI-Powered Analytics Platform

> **Upload data → Get AI-generated insights + dashboard + charts + natural language querying**

Analytica is a comprehensive analytics platform that uses Google's Gemini AI to automatically analyze datasets, generate insights, create visualizations, and enable natural language data querying.

![Analytica Platform](https://img.shields.io/badge/Built%20with-AI-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)

## ✨ Features

### 🤖 AI-Powered Analysis
- **Automatic Data Profiling**: Statistics, missing values, outliers, duplicates
- **AI-Generated Insights**: Trends, patterns, anomalies, and business recommendations
- **Smart Chart Suggestions**: AI determines the best visualizations for your data

### 📊 Interactive Dashboards
- **Auto-Generated Charts**: Bar, Line, Pie, Scatter, Histogram
- **KPI Cards**: Key metrics at a glance
- **Data Quality Reports**: Comprehensive quality scoring

###💬 Chat with Your Data
- **Natural Language Queries**: "What is the average salary in IT?"
- **AI-Powered Code Generation**: Converts questions to Pandas/SQL
- **Interactive Results**: Get answers with visualizations

### 📁 Data Management
- **Multiple Format Support**: CSV, Excel (.xlsx/.xls), JSON
- **Secure Storage**: MongoDB with user isolation
- **Dataset History**: Track all your uploads

## 🏗️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **MongoDB**: NoSQL database with Motor (async driver)
- **Google Gemini AI**: For insights and natural language processing
- **Pandas & NumPy**: Data analysis and processing
- **JWT Authentication**: Secure user management

### Frontend
- **React 18**: Modern UI library
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first styling with custom design system
- **Recharts**: Beautiful, responsive charts
- **Axios**: HTTP client with interceptors
- **React Router**: Client-side routing

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB (local or Atlas)
- Gemini API Key

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd Analytica
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Edit backend/.env with your settings:
# - MONGODB_URI: MongoDB connection string
# - GEMINI_API_KEY: Google Gemini API key (already configured)
# - JWT_SECRET_KEY: Secret key for JWT tokens (change in production)
# - CHAT_RATE_LIMIT: Rate limit for chat queries (default: "10/minute")
```

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
```

#### 4. Start MongoDB
```bash
# Option 1: Local MongoDB
mongod

# Option 2: Use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend/.env with Atlas connection string
```

#### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
# Backend runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

#### 6. Open the App
Navigate to [http://localhost:5173](http://localhost:5173)

## 📖 Usage Guide

### 1. Create Account
- Register with your email and password
- Automatically logged in after registration

### 2. Upload Dataset
- Drag & drop or click to upload CSV/Excel/JSON
- Automatic analysis starts immediately
- View results in the dashboard

### 3. Explore Dashboard
- **KPI Cards**: Key metrics overview
- **Visualizations**: Auto-generated charts
- **AI Insights**: Trends, patterns, recommendations
- **Data Quality**: Quality score and issues

### 4. Chat with Data
- Click "Chat with Data" button
- Ask questions in plain English:
  - "What is the average value?"
  - "Show top 5 categories"
  - "Find any outliers"
  - "What are the trends over time?"
- Get instant answers with visualizations

### 5. View Reports
- Access all analyzed datasets
- Download reports (PDF/HTML coming soon)

## 📂 Project Structure

```
Analytica/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── routes/
│   │   ├── auth.py            # Authentication endpoints
│   │   ├── upload.py          # File upload & dataset management
│   │   ├── analysis.py        # Data analysis endpoints
│   │   └── chat.py            # Natural language querying
│   ├── services/
│   │   ├── ai_service.py      # Gemini AI integration
│   │   ├── data_analysis.py   # Data profiling & statistics
│   │   ├── chart_generator.py # Chart configuration
│   │   └── query_executor.py  # Safe code execution
│   ├── models/
│   │   ├── user_model.py      # User & auth models
│   │   ├── dataset_model.py   # Dataset metadata
│   │   ├── analysis_model.py  # Analysis results
│   │   └── chat_model.py      # Chat history
│   └── utils/
│       ├── database.py        # MongoDB connection
│       ├── helpers.py         # Utility functions
│       └── prompts.py         # AI prompt templates
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── UploadBox.jsx
│   │   │   ├── ChartCard.jsx
│   │   │   ├── InsightPanel.jsx
│   │   │   ├── ChatBox.jsx
│   │   │   └── KPICard.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   └── Reports.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js         # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Datasets
- `POST /api/upload/` - Upload dataset
- `GET /api/upload/datasets` - List datasets
- `GET /api/upload/dataset/{id}` - Get dataset details
- `DELETE /api/upload/dataset/{id}` - Delete dataset

### Analysis
- `POST /api/analysis/analyze/{id}` - Analyze dataset
- `GET /api/analysis/{id}` - Get analysis results
- `GET /api/analysis/{id}/quality` - Get quality report
- `GET /api/analysis/{id}/insights` - Get AI insights

### Chat
- `POST /api/chat/query` - Send query
- `GET /api/chat/history/{id}` - Get chat history
- `DELETE /api/chat/history/{id}` - Clear history

## 🎨 Design Highlights

- **Glassmorphism UI**: Beautiful frosted glass effects
- **Gradient Animations**: Dynamic, eye-catching gradients
- **Smooth Transitions**: Polished micro-animations
- **Responsive Design**: Works on all screen sizes
- **Dark Theme**: Modern, easy on the eyes
- **Custom Color Palette**: Professional blue-purple gradient scheme

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Safe code execution sandbox for AI-generated queries
- User data isolation in MongoDB
- **API Rate Limiting**: Prevents API quota exhaustion (configurable via `CHAT_RATE_LIMIT`)
  - Default: 10 chat queries per minute per user
  - Returns HTTP 429 with `Retry-After` header when limit is exceeded
  - Protects against abuse and controls AI API costs

## 🌟 Future Enhancements

- [ ] PDF/PPT report export
- [ ] Database connections (PostgreSQL, MySQL)
- [ ] Real-time collaboration
- [ ] Scheduled reports
- [ ] Advanced chart customization
- [ ] Data transformation pipeline
- [x] API rate limiting
- [ ] Email notifications
- [ ] Dark/Light theme toggle
- [ ] Multi-language support

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongod --version

# Or use MongoDB Atlas cloud connection
# Update MONGODB_URI in .env
```

### Gemini API Error
```bash
# Verify API key is correct in backend/.env
# Check API quota at https://ai.google.dev/
```

### Frontend Can't Connect to Backend
```bash
# Ensure backend is running on port 8000
# Check CORS settings in backend/main.py
```

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using FastAPI, React, and Google Gemini AI**
