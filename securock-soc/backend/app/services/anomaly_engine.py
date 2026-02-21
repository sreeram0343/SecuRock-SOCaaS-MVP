import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import logging

logger = logging.getLogger(__name__)

class AnomalyEngine:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1, random_state=42)
        # Dummy weights for risk scoring
        self.asset_criticality = 1.5
        self.recurrence_weight = 1.2
        self.critical_threshold = 80.0

    def extract_features(self, data: list):
        # Convert raw logs/alerts to numerical features for IF
        df = pd.DataFrame(data)
        if df.empty:
            return pd.DataFrame()
        
        features = pd.DataFrame()
        features['level'] = df.get('level', pd.Series([3]*len(df))).astype(float)
        features['desc_len'] = df.get('description', pd.Series(['']*len(df))).apply(len).astype(float)
        
        return features

    def run_detection(self, data: list):
        if not data:
            return []

        features = self.extract_features(data)
        if features.empty:
            return []

        # Predict anomaly (-1 is anomaly, 1 is normal)
        self.model.fit(features)
        predictions = self.model.predict(features)
        scores = self.model.decision_function(features) # lower is more anomalous

        results = []
        for i, row in enumerate(data):
            # Normalize anomaly score to 0-100
            anomaly_score = float(max(0, min(100, -scores[i] * 100 + 50)))
            
            # Weighted scoring
            level = float(row.get('level', 3))
            base_risk = (level * 5) + (anomaly_score * 0.5)
            risk_score = min(100.0, base_risk * self.asset_criticality * self.recurrence_weight)
            
            severity = "CRITICAL" if risk_score > self.critical_threshold else "HIGH" if risk_score > 60 else "MEDIUM" if risk_score > 30 else "LOW"

            results.append({
                "host": row.get("agent_name", "unknown-host"),
                "event": row.get("description", "Unknown Event"),
                "anomaly_score": round(anomaly_score, 2),
                "risk_score": round(risk_score, 2),
                "severity": severity
            })

        return results

anomaly_engine = AnomalyEngine()
