# Module 2: Backend Foundation

## 📋 Overview
Production-ready Express.js server with MongoDB connection, Redis setup, global error handling, request logging, and health check API. All files follow the `filename.type.js` naming convention.

---

## 📁 File Naming Convention

All project files use the format `filename.type.js`:

| Type | Example | Purpose |
|------|---------|---------|
| `.config.js` | `env.config.js` | Configuration |
| `.model.js` | `user.model.js` | Mongoose schemas |
| `.controller.js` | `auth.controller.js` | Route handlers |
| `.service.js` | `auth.service.js` | Business logic |
| `.route.js` | `health.route.js` | Express routers |
| `.middleware.js` | `error.middleware.js` | Middleware |
| `.util.js` | `appError.util.js` | Utilities |

---

## 📁 Backend Structure

```
backend/src/
├── index.js                      # Express entry point
├── config/
│   ├── env.config.js             # Centralized env validation
│   ├── db.config.js              # MongoDB connection (Mongoose)
│   └── redis.config.js           # Redis connection (ioredis)
├── controllers/                  # (Module 3+)
├── services/                     # (Module 3+)
├── models/                       # (Module 4+)
├── routes/
│   └── health.route.js           # GET /api/health
├── middleware/
│   ├── error.middleware.js       # Global error handler
│   └── logger.middleware.js      # Morgan HTTP logger
└── utils/
    └── appError.util.js          # Custom error class
```

---

## ⚙️ Key Files Detail

### `src/index.js` — Entry Point
- Loads env → connects MongoDB → connects Redis → starts Express
- Registers middleware: `helmet`, `cors`, `json`, `morgan`
- Mounts routes → 404 handler → global error handler

### `src/config/env.config.js`
- Loads `.env` via `dotenv`
- Validates required vars in production
- Exports centralized config object

### `src/config/db.config.js`
- `mongoose.connect()` with auto-retry on failure (5s interval)
- Disconnect/error event listeners

### `src/config/redis.config.js`
- `ioredis` client with lazy connect
- Connect/error event listeners
- Exported: `redis` instance + `connectRedis()` function

### `src/middleware/error.middleware.js`
- Catches all errors → returns `{ success, message }`
- Shows `stack` trace only in development

### `src/middleware/logger.middleware.js`
- Morgan: `dev` format locally, `combined` in production

### `src/utils/appError.util.js`
- Custom Error class with `statusCode` and `isOperational` flag

---

## 📡 API

### GET /api/health
**Purpose:** Server health check

**Response (200):**
```json
{
  "success": true,
  "status": "ok",
  "service": "trueshield-backend",
  "uptime": "12s",
  "dbState": "connected",
  "timestamp": "2026-03-22T05:30:00.000Z"
}
```

---

## 🧪 Test with Postman

| # | Method | URL | Expected |
|---|--------|-----|----------|
| 1 | GET | `http://localhost:5000/api/health` | 200 — status ok |
| 2 | GET | `http://localhost:5000/api/nonexistent` | 404 — route not found |

---

## ✅ Status: COMPLETE
