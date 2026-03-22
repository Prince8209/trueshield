# Module 3: Authentication (OTP)

## 📋 Overview
OTP-based authentication system — send OTP to phone, store in Redis with 5-min TTL, verify and return JWT token. Includes middleware to protect routes.

---

## 🔐 Auth Flow

```
1. Client → POST /api/auth/send-otp { phone: "+919876543210" }
2. Server → Generate OTP → Store in Redis (key: otp:+919876543210, TTL: 5min)
3. Server → Send OTP (dev: console log, prod: Twilio)
4. Server → Response { success: true, message: "OTP sent successfully" }

5. Client → POST /api/auth/verify-otp { phone: "+919876543210", otp: "123456" }
6. Server → Get OTP from Redis → Compare → Delete OTP
7. Server → Find or create User in MongoDB
8. Server → Generate JWT token
9. Server → Response { success: true, token: "eyJ...", user: {...} }
```

> **Dev mode:** OTP is always `123456` and logged to console.

---

## 📁 Files Created

```
backend/src/
├── models/
│   └── user.model.js              # User schema (phone, name, email)
├── services/
│   ├── otp.service.js             # OTP generate/store/send/delete
│   └── auth.service.js            # Auth flow orchestration
├── controllers/
│   └── auth.controller.js         # HTTP handlers for auth
├── routes/
│   └── auth.route.js              # POST /send-otp, /verify-otp
├── middleware/
│   └── auth.middleware.js         # JWT protect middleware
└── utils/
    └── generateToken.util.js      # JWT sign utility
```

---

## 📡 APIs

### POST /api/auth/send-otp
**Access:** Public

**Request:**
```json
{ "phone": "+919876543210" }
```

**Response (200):**
```json
{ "success": true, "message": "OTP sent successfully" }
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Phone number is required |
| 400 | Invalid phone number format |

---

### POST /api/auth/verify-otp
**Access:** Public

**Request:**
```json
{ "phone": "+919876543210", "otp": "123456" }
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "664f...",
    "phone": "+919876543210",
    "name": "",
    "email": "",
    "createdAt": "2026-03-22T05:30:00.000Z"
  }
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Phone number and OTP are required |
| 400 | OTP expired or not found |
| 400 | Invalid OTP |

---

## 🔒 Protected Routes (for future modules)

Add `protect` middleware to any route:
```js
const { protect } = require('../middleware/auth.middleware');
router.get('/profile', protect, userController.getProfile);
```

**Header required:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🧪 Test with Postman

### 1. Send OTP
| Field | Value |
|-------|-------|
| Method | POST |
| URL | `http://localhost:5000/api/auth/send-otp` |
| Body (JSON) | `{ "phone": "+919876543210" }` |
| Expected | 200 — OTP sent |

### 2. Verify OTP
| Field | Value |
|-------|-------|
| Method | POST |
| URL | `http://localhost:5000/api/auth/verify-otp` |
| Body (JSON) | `{ "phone": "+919876543210", "otp": "123456" }` |
| Expected | 200 — token + user |

### 3. Test Protected Route (future)
| Field | Value |
|-------|-------|
| Header | `Authorization: Bearer <token_from_step_2>` |

---

## ✅ Status: COMPLETE
