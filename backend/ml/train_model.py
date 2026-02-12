
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import os

# Ensure models directory exists
os.makedirs("models", exist_ok=True)

def train_model(data_path, model_path):
    print(f"Loading data from {data_path}...")
    try:
        df = pd.read_csv(data_path)
    except FileNotFoundError:
        print("Data file not found. Creating mock data.")
        # Create mock data if file doesn't exist
        df = pd.DataFrame({
            'panel_size': np.random.normal(100, 10, 100),
            'duration': np.random.normal(50, 5, 100)
        })

    # Feature Engineering (Simplified)
    # In a real scenario, we'd encode IPs, event types, etc.
    # Here we just use numerical columns if available, or create dummy features
    
    # Let's say we process 'packet_size' and 'duration'
    features = ['packet_size', 'duration']
    
    # Handle missing columns for robustness
    for col in features:
        if col not in df.columns:
            df[col] = 0
            
    X = df[features]

    print("Training Isolation Forest model...")
    clf = IsolationForest(random_state=42, contamination=0.1)
    clf.fit(X)

    print(f"Saving model to {model_path}...")
    joblib.dump(clf, model_path)
    print("Training complete.")

if __name__ == "__main__":
    train_model("sample_data/training_logs.csv", "models/anomaly_detector.pkl")
