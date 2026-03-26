import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Paths
DATA_PATH = os.path.join(os.path.dirname(__file__), '../backend/scripts/raw/sms-spam/SMSSpamCollection')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'spam_model.pkl')
VEC_PATH = os.path.join(os.path.dirname(__file__), 'vectorizer.pkl')

def train_model():
    print("🚀 Starting TrueShield AI Training...")
    
    # 1. Load Data
    print(f"📦 Loading dataset from: {DATA_PATH}")
    try:
        df = pd.read_csv(DATA_PATH, sep='\t', names=['label', 'message'])
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        return

    print(f"📊 Dataset loaded. Shape: {df.shape}")
    
    # Map labels to binary: spam=1, ham=0
    df['label_num'] = df.label.map({'ham': 0, 'spam': 1})

    # 2. Split Data
    X_train, X_test, y_train, y_test = train_test_split(
        df['message'], 
        df['label_num'], 
        test_size=0.2, 
        random_state=42
    )
    print(f"✂️ Split complete. Train: {len(X_train)}, Test: {len(X_test)}")

    # 3. Vectorize Text (TF-IDF)
    print("🧮 Vectorizing text via TF-IDF...")
    vectorizer = TfidfVectorizer(stop_words='english', max_df=0.9)
    X_train_transformed = vectorizer.fit_transform(X_train)
    X_test_transformed = vectorizer.transform(X_test)

    # 4. Train Model
    print("🧠 Training Multinomial Naive Bayes model...")
    model = MultinomialNB()
    model.fit(X_train_transformed, y_train)

    # 5. Evaluate
    predictions = model.predict(X_test_transformed)
    acc = accuracy_score(y_test, predictions)
    print(f"✅ Training Complete. Accuracy: {acc:.4f}")
    print("\nclassification_report:")
    print(classification_report(y_test, predictions, target_names=['Ham', 'Spam']))

    # 6. Save Model
    print("💾 Saving model files to disk...")
    joblib.dump(model, MODEL_PATH)
    joblib.dump(vectorizer, VEC_PATH)
    print("🎉 Done! Ready for production deployment.")

if __name__ == '__main__':
    train_model()
