# Module 1: Project Setup

## 📋 Overview
Initial scaffolding of all three services — Backend (Node.js/Express), Frontend (React/Vite), and AI Service (Python/FastAPI) — with folder structures, dependencies, and dev configurations.

---

## 📁 Folder Structure

```
trueshield/
├── .gitignore
├── README.md
├── backend/
│   ├── .env / .env.example
│   ├── package.json
│   └── src/
│       ├── index.js              # Express entry point
│       ├── config/
│       │   ├── env.js            # Centralized env validation
│       │   ├── db.js             # MongoDB connection (Mongoose)
│       │   └── redis.js          # Redis connection (ioredis)
│       ├── controllers/          # Route handlers (Module 2+)
│       ├── services/             # Business logic (Module 2+)
│       ├── models/               # Mongoose schemas (Module 4+)
│       ├── routes/
│       │   └── healthRoutes.js   # GET /api/health
│       ├── middleware/
│       │   ├── errorHandler.js   # Global error handler
│       │   └── logger.js         # Morgan HTTP logger
│       └── utils/
│           └── AppError.js       # Custom error class
├── frontend/
│   ├── vite.config.js            # Tailwind v4 + API proxy → :5000
│   ├── package.json
│   └── src/
│       ├── App.jsx               # Root component + React Router
│       ├── index.css             # Tailwind import
│       ├── services/
│       │   └── api.js            # Axios instance + JWT interceptor
│       ├── components/           # (Module 11)
│       ├── pages/                # (Module 11)
│       ├── hooks/                # (Module 11)
│       └── utils/                # (Module 11)
└── ai-service/
    ├── requirements.txt          # Pinned Python deps
    ├── .env / .env.example
    ├── venv/                     # Python virtual environment
    └── app/
        ├── __init__.py
        ├── main.py               # FastAPI + CORS + /health
        ├── models/               # ML models (Module 9)
        ├── routes/               # API endpoints (Module 9)
        ├── services/             # ML logic (Module 9)
        └── utils/                # Helpers (Module 9)
```

---

## 📦 Dependencies Installed

### Backend (Node.js)
| Package | Purpose |
|---------|---------|
| express | Web framework |
| mongoose | MongoDB ODM |
| cors | Cross-origin requests |
| dotenv | Environment variables |
| helmet | Security headers |
| morgan | HTTP request logging |
| jsonwebtoken | JWT authentication |
| bcryptjs | Password hashing |
| ioredis | Redis client |
| axios | HTTP client (call AI service) |
| express-validator | Input validation |
| express-rate-limit | Rate limiting |
| nodemon (dev) | Auto-restart on changes |

### Frontend (React)
| Package | Purpose |
|---------|---------|
| tailwindcss + @tailwindcss/vite | Utility-first CSS (v4) |
| axios | API calls |
| react-router-dom | Client-side routing |
| react-hot-toast | Toast notifications |

### AI Service (Python)
| Package | Version |
|---------|---------|
| fastapi | 0.135.1 |
| uvicorn | 0.42.0 |
| scikit-learn | 1.8.0 |
| pandas | 3.0.1 |
| pydantic | 2.12.5 |
| python-dotenv | 1.2.2 |

---

## 🚀 How to Run

### Backend
```bash
cd backend
npm install
cp .env.example .env      # Edit with your credentials
npm run dev                # Starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                # Starts on http://localhost:5173
```

### AI Service
```bash
cd ai-service
python -m venv venv
.\venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## 🧪 Test with Postman

### Health Check — Backend
| Field | Value |
|-------|-------|
| Method | GET |
| URL | `http://localhost:5000/api/health` |
| Expected Status | 200 |

**Expected Response:**
```json
{
  "success": true,
  "status": "ok",
  "service": "trueshield-backend",
  "uptime": "5s",
  "dbState": "connected",
  "timestamp": "2026-03-21T00:00:00.000Z"
}
```

### Health Check — AI Service
| Field | Value |
|-------|-------|
| Method | GET |
| URL | `http://localhost:8000/health` |
| Expected Status | 200 |

**Expected Response:**
```json
{
  "status": "ok",
  "service": "trueshield-ai-service"
}
```

---

## ✅ Status: COMPLETE
