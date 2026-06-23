import os
import datetime

try:
    import joblib
    import numpy as np
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False
    print("⚠️ ML dependencies not found. Specific ML features will be disabled.")

class MLService:
    def __init__(self):
        self.model = None
        # Try multiple paths to find the model
        base_paths = [
            "app/models/saved_models/isolation_forest.joblib",  # New standard path
            "backend/app/models/saved_models/isolation_forest.joblib",
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

        # Typical statistical baselines for traffic features (packet_size, duration, request_rate)
        # Used for z-score explainability and contribution calculation
        self.baselines = {
            "packet_size": {"mean": 350.0, "std": 120.0, "unit": "bytes"},
            "duration": {"mean": 4.5, "std": 2.5, "unit": "seconds"},
            "request_rate": {"mean": 12.0, "std": 6.0, "unit": "req/sec"}
        }

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
        analysis = self.explain_anomaly(features)
        return analysis["risk_score"]

    def explain_anomaly(self, features: list, event_type: str = "") -> dict:
        """
        Explain the anomaly using statistical deviation & Isolation Forest decision values.
        features: [packet_size, duration, request_rate]
        Returns a dictionary with risk score, confidence, reasoning, and MITRE mapping.
        """
        # 1. Validation Check
        if not features or len(features) != 3:
            return {
                "risk_score": 0.0,
                "confidence": 0.0,
                "reasoning": "Insufficient telemetry feature dimensions. Missing packet size, duration, or rate.",
                "primary_feature": None,
                "mitre_mapping": [],
                "contributions": {}
            }

        packet_size, duration, request_rate = features
        
        # 2. Compute statistical deviations (z-scores) to explain contribution
        deviations = {}
        for idx, (feat_name, stats) in enumerate(self.baselines.items()):
            val = features[idx]
            z_score = abs(val - stats["mean"]) / max(stats["std"], 1.0)
            deviations[feat_name] = {
                "value": val,
                "z_score": z_score,
                "deviation_ratio": val / max(stats["mean"], 1.0)
            }

        # Find the feature that deviated the most
        primary_feat = max(deviations, key=lambda k: deviations[k]["z_score"])
        max_deviation = deviations[primary_feat]

        # 3. Predict Anomaly Score using Isolation Forest (if loaded)
        is_anomaly = False
        decision_score = 0.0
        
        if self.model and ML_AVAILABLE:
            try:
                # Decision score < 0 means anomaly
                decision_score = self.model.decision_function([features])[0]
                is_anomaly = bool(decision_score < 0)
            except Exception as e:
                print(f"Prediction error: {e}")
                is_anomaly = max_deviation["z_score"] > 3.0 # Fallback heuristic
        else:
            # Fallback heuristic if ML model is unavailable
            is_anomaly = max_deviation["z_score"] > 3.0

        # Calculate normalized risk score and confidence (0.0 - 1.0 scale)
        if is_anomaly:
            # More negative decision score or higher z-score means higher risk
            if self.model and ML_AVAILABLE:
                raw_risk = min(abs(decision_score) + 0.5, 1.0)
            else:
                raw_risk = min(0.5 + (max_deviation["z_score"] * 0.1), 1.0)
            risk_score = float(raw_risk)
            confidence = float(min(0.6 + (max_deviation["z_score"] * 0.05), 0.98))
        else:
            # Background risk or very minor deviation
            risk_score = float(min(max_deviation["z_score"] * 0.05, 0.3))
            confidence = 0.90

        # 4. Generate Reasoning Narrative
        if risk_score > 0.6:
            unit = self.baselines[primary_feat]["unit"]
            baseline_val = self.baselines[primary_feat]["mean"]
            reasoning = (
                f"Anomalous activity detected. The metric '{primary_feat}' is currently {max_deviation['value']} {unit}, "
                f"which represents a {max_deviation['deviation_ratio']:.1f}x deviation from the normal baseline of "
                f"{baseline_val} {unit}."
            )
        else:
            reasoning = "Network telemetry metrics within normal statistical limits."

        # 5. MITRE ATT&CK Mapping based on contributing feature
        mitre_mapping = []
        if risk_score > 0.6:
            if primary_feat == "packet_size":
                mitre_mapping.append({
                    "id": "T1048.002",
                    "name": "Exfiltration Over Alternative Protocol: Exfiltration Over Asymmetric Channel",
                    "description": "Attacker exfiltrates data using differing sizes or protocol layouts to bypass network bounds."
                })
            elif primary_feat == "duration":
                mitre_mapping.append({
                    "id": "T1071.001",
                    "name": "Application Layer Protocol: Web Protocols",
                    "description": "Attacker maintains persistent connections (C2 channels) mimicking normal web browsing sessions."
                })
            elif primary_feat == "request_rate":
                mitre_mapping.append({
                    "id": "T1110",
                    "name": "Brute Force",
                    "description": "Attacker triggers high-volume request bursts attempting credential stuffing or endpoint scanning."
                })

        # Compile contributions payload
        total_z = sum(d["z_score"] for d in deviations.values())
        contributions = {}
        for feat, data in deviations.items():
            contributions[feat] = float(data["z_score"] / max(total_z, 1.0))

        return {
            "risk_score": risk_score,
            "confidence": confidence,
            "reasoning": reasoning,
            "primary_feature": primary_feat,
            "mitre_mapping": mitre_mapping,
            "contributions": contributions
        }

ml_service = MLService()
