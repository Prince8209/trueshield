# Module 9: Python AI Service

## 🎯 Objectives
Because scammers frequently rotate or spoof phone numbers, simple Caller ID isn't enough to stop modern phishing attacks. Module 9 introduces an independent **Natural Language Processing (NLP)** microservice written in Python that computationally analyzes the text content of an SMS to predict if it is a scam.

## 🏗️ Architecture & Implementation

### 1. The Machine Learning Engine (`ai/train.py`)
- We utilized the global `SMSSpamCollection` dataset containing over 5,500 labeled real-world text messages.
- Pre-processing uses SciKit-Learn's `TfidfVectorizer` to break down SMS messages into mathematical matrices based on word frequency and importance (TF-IDF).
- The prediction model is a `MultinomialNB` (Naive Bayes) classifier, ideal for text-based probabilistic scoring.
- After training, the script serializes (`joblib.dump`) the trained model (`spam_model.pkl`) and the vocabulary vectorizer (`vectorizer.pkl`) directly into the `ai/` directory.

### 2. High-Performance API (`ai/main.py`)
- We wrote the server using `FastAPI` to execute the inference in an asynchronous web boundary.
- On startup, the server loads both `.pkl` models directly into memory.
- The `POST /predict` endpoint consumes a JSON payload: `{"text": "Win free money!"}`.
- It transforms the text, runs `.predict_proba()`, and returns a structured response indicating `is_spam: True/False` and a `confidence` %.

## 🧪 Testing Results
The model proved incredibly precise. During the `train_test_split`, it yielded an exact **98% global accuracy**.
When querying the active FastAPI server via `backend/tests/test_module9.js`, the latency averaged an astonishing **~4 milliseconds** per request!

**Examples from Test Run:**
- 💬 *"Hey Mom, what time is dinner?"* 
  <br>✅ SAFE (Confidence: 99.51%)
- 💬 *"WINNER!! You have been selected to receive a £900 prize reward!"*
  <br>🚫 SPAM (Confidence: 93.97%)
- 💬 *"URGENT: Your account has been locked. Click here to verify http://scam.link.com"*
  <br>🚫 SPAM (Confidence: 73.99%)

## 🚀 Next Steps
We now have a brilliant, self-contained AI microservice running on Localhost port 8000. In **Module 10: Node <-> Python Integration**, we will write the specific Node.js controllers inside our main `trueshield-backend` so that the mobile/web app users can post their suspicious text messages and instantly get a TrueShield Scam Warning back on their devices.
