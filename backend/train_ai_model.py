import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import pandas as pd
from datetime import datetime
import os

# Create model directory
MODEL_DIR = "app/models/saved_models"
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, "isolation_forest.joblib")

def generate_synthetic_data(n_samples=1000):
    """Generate synthetic network traffic data for training."""
    rng = np.random.RandomState(42)
    
    # Normal traffic features: [packet_size, duration, request_rate_per_sec]
    X_normal = 0.3 * rng.randn(n_samples, 3)
    X_normal = np.r_[X_normal + 2, X_normal - 2]
    
    # Anomalous traffic (outliers)
    X_outliers = rng.uniform(low=-4, high=4, size=(int(n_samples * 0.1), 3))
    
    X = np.r_[X_normal, X_outliers]
    return X

def train_model():
    print(f"[{datetime.now()}] Generating synthetic training data...")
    X_train = generate_synthetic_data(2000)
    
    print(f"[{datetime.now()}] Training Isolation Forest model...")
    # Contamination matches the ratio of outliers we expect
    clf = IsolationForest(contamination=0.1, random_state=42, n_jobs=-1)
    clf.fit(X_train)
    
    print(f"[{datetime.now()}] Saving model to {MODEL_PATH}...")
    joblib.dump(clf, MODEL_PATH)
    print("Training complete.")

if __name__ == "__main__":
    train_model()
