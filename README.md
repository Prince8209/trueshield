# 🛡️ TrueShield

**AI-Powered Phone Number Intelligence & Spam Detection Platform**

A production-grade system built with MERN stack + Python FastAPI microservice that identifies phone numbers, detects spam using AI/ML models, and provides a modern dashboard for phone intelligence.

---

## ✨ Features

- 📞 **Phone Number Lookup** — Identify name, location, carrier
- 🤖 **AI Spam Detection** — ML-powered spam probability scoring
- 🚨 **Spam Reporting** — Community-driven spam database
- 🔐 **OTP Authentication** — Secure phone-based login with Redis
- ⚡ **Redis Caching** — Sub-millisecond lookups
- 📊 **Dashboard** — Personal reports & system stats

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express.js + Mongoose |
| AI Service | Python + FastAPI + Scikit-learn |
| Database | MongoDB Atlas |
| Cache | Redis |
| Auth | JWT + OTP |
| DevOps | Docker + Docker Compose |

## 📁 Project Structure

```
trueshield/
├── backend/          # Node.js API Gateway
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── services/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       └── utils/
├── frontend/         # React + Vite
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       └── utils/
├── ai-service/       # Python FastAPI
│   └── app/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB Atlas account
- Redis server

### Backend
```bash
cd backend
npm install
cp .env.example .env    # edit with your credentials
npm run dev             # starts on :5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev             # starts on :5173
```

### AI Service
```bash
cd ai-service
python -m venv venv
.\venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/send-otp` | Send OTP |
| POST | `/api/auth/verify-otp` | Verify OTP & get JWT |
| GET | `/api/users/profile` | Get user profile |
| GET | `/api/search/:number` | Search phone number |
| POST | `/api/spam/report` | Report spam |
| GET | `/api/spam/score/:number` | Get spam score |
| POST | `:8000/predict` | AI spam prediction |

## 📄 License

MIT
