from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os

app = FastAPI(
    title="TrueShield AI",
    description="NLP microservice for detecting SMS spam and phishing attacks.",
    version="1.0.0"
)

# Paths
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'spam_model.pkl')
VEC_PATH = os.path.join(os.path.dirname(__file__), 'vectorizer.pkl')

# Global variables for models
model = None
vectorizer = None

@app.on_event("startup")
def load_model():
    global model, vectorizer
    if os.path.exists(MODEL_PATH) and os.path.exists(VEC_PATH):
        print("🧠 Loading AI model into memory...")
        model = joblib.load(MODEL_PATH)
        vectorizer = joblib.load(VEC_PATH)
        print("✅ Models loaded successfully.")
    else:
        print("⚠️ Warning: Model files not found. Please run train.py first.")

class SMSRequest(BaseModel):
    text: str

class SMSResponse(BaseModel):
    is_spam: bool
    confidence: float
    original_text: str

@app.get("/health")
def health_check():
    if model is None or vectorizer is None:
        return {"status": "degraded", "message": "Models not loaded"}
    return {"status": "healthy", "service": "TrueShield AI"}

@app.post("/predict", response_model=SMSResponse)
def predict_sms(request: SMSRequest):
    if model is None or vectorizer is None:
        raise HTTPException(status_code=503, detail="Models not loaded. Wait for startup or run training.")

    text = request.text
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    # Vectorize
    vec_text = vectorizer.transform([text])
    
    # Predict
    prediction = model.predict(vec_text)[0]
    probabilities = model.predict_proba(vec_text)[0]
    
    is_spam = bool(prediction == 1)
    
    # Confidence is the probability of the *predicted* class
    confidence = float(probabilities[1] if is_spam else probabilities[0])

    return SMSResponse(
        is_spam=is_spam,
        confidence=round(confidence * 100, 2), # e.g., 99.85
        original_text=text
    )
