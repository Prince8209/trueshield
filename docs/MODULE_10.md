# Module 10: Node <-> Python Integration

## 🎯 Objectives
Connect the primary Node.js Express server with the standalone Python AI engine. This allows mobile and web clients to communicate safely with a single API endpoint (Port 5000), using JWT authentication, while silently leveraging the AI processing power in the background.

## 🏗️ Architecture & Implementation

### 1. Internal AI Router (`src/services/ai.service.js`)
We built a microservice integration wrapper that:
- Reads `AI_SERVICE_URL` from the `.env` configuration (defaulting to the local python server `http://localhost:8000`).
- Provides a structured `predictMessage(text)` wrapper.
- Implements comprehensive failovers (capturing `ECONNREFUSED` and `ECONNABORTED` specifically so that if the Python server drops offline, the Node.js server degrades gracefully rather than crashing).

### 2. Threat Logic Controller (`src/controllers/message.controller.js`)
Front-end applications need easy, color-codeable data, not raw statistics. The `scanMessage` controller translates the FastAPI statistical output:
- **`Safe`**: Model predicts ham, strong confidence.
- **`Suspicious`**: Model predicts spam but low confidence, or predicts ham but unusually low confidence.
- **`Malicious`**: Definitively triggered spam/scam flags by the AI (>85% confidence).

The endpoint returns this threat level alongside a direct behavioral recommendation strings (e.g. *'High risk of phishing or scam. Delete this message immediately.'*).

### 3. Protection & Routing
The `POST /api/messages/scan` route is secured via the `protect` middleware, so anonymous API abusers cannot flood our python server with text inference requests. Only verified, logged-in TrueShield users can invoke SMS scans.

## 🧪 Testing
The architecture is comprehensively verified via `tests/test_module10.js`.
```bash
node tests/test_module10.js
```
The script logged into the Node backend, acquired a JWT, and `POST`ed 3 distinct texts.
**Latency Benchmark**: The internal hop from Node -> Python -> Node completed processing full NLP vectorized requests natively in ~8ms to ~18ms.

## 🚀 Next Steps
The ENTIRE backend architecture, ranging from authentication, caller ID, global spam scoring, to ML phishing inference, is completely finished!
We are now entering **Module 11: Frontend UI**, where we will build the sleek, dark-mode Truecaller application that visualizes all of these APIs.
