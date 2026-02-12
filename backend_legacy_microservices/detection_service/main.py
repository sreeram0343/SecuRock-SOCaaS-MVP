import redis
import requests
import json
import os
import time
from shared.schemas import LogEntry, AlertCreate, Severity
from .detection import AnomalyDetector

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
ALERT_SERVICE_URL = os.getenv("ALERT_SERVICE_URL", "http://localhost:8000")

detector = AnomalyDetector()

def process_logs():
    print("Connecting to Redis...")
    try:
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)
    except Exception as e:
        print(f"Redis connection failed: {e}")
        return

    print("Waiting for logs...")
    while True:
        # Blocking pop
        item = r.blpop("logs_queue", timeout=5)
        if item:
            _, log_data = item
            try:
                log_json = json.loads(log_data)
                # log_entry = LogEntry(**log_json) # Validated log
                
                features = detector.extract_features(log_json)
                prediction = detector.predict(features)
                
                if prediction == -1:
                    print(f"Anomaly detected! {log_json.get('source_ip')}")
                    # Send alert
                    alert = {
                        "title": f"Anomaly Detected: {log_json.get('event_type')}",
                        "description": log_json.get("message"),
                        "severity": "HIGH",
                        "source_ip": log_json.get("source_ip"),
                        "status": "OPEN"
                    }
                    try:
                        requests.post(f"{ALERT_SERVICE_URL}/alerts", json=alert)
                    except Exception as req_err:
                        print(f"Failed to send alert: {req_err}")
                
            except Exception as e:
                print(f"Error processing log: {e}")

if __name__ == "__main__":
    # Give some time for other services to start
    time.sleep(10) 
    process_logs()
