import os

try:
    import joblib
    import numpy as np
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False
    print("⚠️ ML dependencies not found. specific ML features will be disabled.")

class MLService:
    def __init__(self):
        self.model = None
        # Try multiple paths to find the model
        base_paths = [
            "app/models/saved_models/isolation_forest.joblib",  # New standard path
            "models/saved_models/isolation_forest.joblib",
            "isolation_forest.joblib"
        ]
        self.model_path = None
        for path in base_paths:
            if os.path.exists(path):
                self.model_path = path
                break
        if ML_AVAILABLE:
            self.load_model()
        else:
            print("ML Service running in heuristic mode (no ML libs).")

    def load_model(self):
        if self.model_path and os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                print(f"ML Model loaded from {self.model_path}")
            except Exception as e:
                print(f"Failed to load ML model: {e}")
        else:
            print("ML Model not found. Analyzing without ML model (heuristic only).")

    def predict_anomaly(self, features: list) -> float:
        """
        Predicts anomaly score.
        features: [packet_size, duration, request_rate]
        Returns: confidence score (0.0 to 1.0) where 1.0 is high confidence anomaly.
        """
        if self.model and ML_AVAILABLE:
            try:
                if not features or len(features) != 3:
                     # Fallback if features don't match model expectation
                     return 0.0
                
                # Reshape for single prediction
                score = self.model.decision_function([features])[0]
                
                # Isolation Forest decision_function:
                # < 0: Anomaly
                # > 0: Normal
                # We want a confidence score 0-1.
                
                if score < 0:
                    # It's an anomaly. The more negative, the more anomalous.
                    # decision_function yields values roughly between -0.5 and 0.5
                    confidence = min(abs(score) + 0.5, 1.0)
                    return confidence
                else:
                    return 0.0 # Normal
            except Exception as e:
                print(f"Prediction error: {e}")
                return 0.0
        
        return 0.0

ml_service = MLService()
