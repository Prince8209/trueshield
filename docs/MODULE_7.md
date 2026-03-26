# Module 7: Spam Reporting System

## 🎯 Objectives
Empower users to report numbers as spam/scam, thereby automatically adjusting the global logic. This forms the foundational "crowdsourcing" architecture of TrueShield, ensuring our database grows smarter organically without relying entirely on third-party APIs.

## 🏗️ Architecture & Implementation

### 1. Relational Integrity (`src/models/spamReport.model.js`)
Created a `SpamReport` schema that links a physical `User` (via JWT ObjectId) to a specific `phoneNumber`.
- Added a MongoDB Compound Index (`{ user: 1, phoneNumber: 1 }` with `unique: true`) to prevent a single user from reporting the same number multiple times and maliciously skewing the global score.

### 2. The Feedback Loop Controllers (`src/controllers/spam.controller.js`)
Two crucial endpoints for managing crowdsourced feedback:
- `POST /api/spam/report`: Validates the E.164 number, validates the JWT, persists the relational log, and updates the `SpamSeed` and `PhoneDirectory` tables. It dynamically calculates the global spam score based on aggregate user report counts (using an ascending geometric function capped at 100%).
- `DELETE /api/spam/unreport`: Removes the user's specific relational vote, gracefully decrementing the global spam profile and removing it entirely from the spam system if `reportCount` reaches 0.

### 3. API Protection
All routes inside `src/routes/spam.route.js` are tightly wrapped with the `protect` JWT middleware. Unauthorized callers are rejected. Mounted cleanly under `/api/spam`.

## 🧪 Testing
The architecture is comprehensively verified via `tests/test_module7.js`.
```bash
node tests/test_module7.js
```
The test suite performs the complete lifecycle:
1. Lookup a clean number (`+919876111111`) -> Default mock score 10%.
2. Authenticate as mocked User.
3. Submit Spam Report -> Success. New score dynamically adjusted to 60%.
4. Search Number again -> Number is now cached as `isSpam: true` globally!
5. User invokes Un-Report -> Score zeroes out organically.

## 🚀 Next Steps
We now have a massive lookup engine and the ability for actual users to dynamically update it. We are ready to move on to **Module 8: Spam Score Engine**. Note that we already built advanced algorithms into `spam.controller.js`, so Module 8 might just involve finalizing dynamic logic or transitioning to the **Module 9: AI Engine** which will calculate the text-message spam profiles.
