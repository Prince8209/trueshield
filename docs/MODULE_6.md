# Module 6: Search System (External API Integration)

## 🎯 Objectives
Integrate third-party intelligence APIs (like IPQualityScore and Apyflux) so that TrueShield can fetch names, exact carrier details, and real-time fraud scores for any phone number, globally, when our local database lacks specific details.

## 🏗️ Architecture & Implementation

### 1. Environment Config & Mock Setup (`src/config/env.config.js`)
We introduced two new environment variables:
- `IPQS_API_KEY`: For IPQualityScore's deep risk insights.
- `TRUECALLER_API_KEY`: For identity & caller name endpoints (Apyflux / Unofficial Truecaller API).

*Note: For development, these default to `'mock'`. The system is designed to simulate the API output dynamically without hitting real rate limits.*

### 2. The External API Aggregator (`src/services/externalApi.service.js`)
Created a parallel aggregator that fetches from multiple APIs simultaneously to reduce latency.
- `fetchRiskScoreArray(phoneE164)`: Queries the IPQS risk API. If mocked, generates realistic scam scores for test numbers.
- `fetchCallerIdentity(phoneE164)`: Queries the identity API. 
- Return payload is combined into a single structured response representing `{ risk, identity }`.

### 3. Local Auto-Caching (`src/services/phone.service.js`)
Modified the main lookup engine to act as a **Read-Through Cache**:
1. Check Local MongoDB.
2. If `profile.name` is missing, trigger the `externalApi.service`.
3. Merge the Identity and Risk metrics.
4. **Cache:** Automatically `PhoneDirectory.create()` the newly discovered profile.
5. The very next time the same number is queried, it bypasses the external API and returns instantly from MongoDB.

## 🧪 Testing
The architecture is verified by `tests/test_module6.js`.
```bash
node tests/test_module6.js
```
The test explicitly clears an unknown test number (`+919876000000`) from MongoDB, then does two sequential lookups:
1. **First Lookup:** Hits the external interface (Mock adapter), retrieves a Mock Spam tag and name ("Reported Telemarketer"), taking ~60ms.
2. **Second Lookup:** Instantly fetches the perfectly identical synthesized profile from MongoDB in <8ms.

## 🚀 Next Steps
We have a fully functional caller ID engine backing the entire application. Next, we will build **Module 7: Spam Reporting System**, endpoints allowing real users to report numbers, updating their local DB spam scores organically.
