from sklearn.ensemble import IsolationForest
import numpy as np
import pickle
import os

MODEL_PATH = "model.pkl"

class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
        self.is_fitted = False
        self.load_model()
        
    def train(self, data):
        # data: list of feature vectors
        if not data:
            return
        self.model.fit(data)
        self.is_fitted = True
        self.save_model()
        print("Model trained and saved.")

    def predict(self, features):
        if not self.is_fitted:
            # Fallback or auto-train on small batch?
            # For MVP, return 1 (normal)
            return 1
        return self.model.predict([features])[0] # 1 for normal, -1 for anomaly

    def save_model(self):
        with open(MODEL_PATH, 'wb') as f:
            pickle.dump(self.model, f)

    def load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                with open(MODEL_PATH, 'rb') as f:
                    self.model = pickle.load(f)
                self.is_fitted = True
                print("Model loaded.")
            except:
                print("Failed to load model.")
        else:
            print("No model found. Training needed.")
            # Auto-train on dummy data for MVP demo functionality
            X_dummy = np.random.rand(100, 2) # Assume 2 features
            self.train(X_dummy)
            
    def extract_features(self, log_entry):
        # Simple feature extraction
        # Feature 1: Length of message
        # Feature 2: Event type hash (simplified)
        f1 = len(log_entry.get("message", ""))
        f2 = hash(log_entry.get("event_type", "")) % 100
        return [f1, f2]
