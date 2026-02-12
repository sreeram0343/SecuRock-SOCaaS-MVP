import requests
import time
import random

BASE_URL = "http://localhost:80/api"

def wait_for_services():
    print("Waiting for services to be up...")
    retries = 30
    while retries > 0:
        try:
            # Check auth service
            requests.get(f"{BASE_URL}/auth/docs", timeout=2)
            print("Services are up!")
            return True
        except:
            time.sleep(2)
            retries -= 1
            print(".")
    return False

def register_admin():
    print("Registering Admin User...")
    try:
        requests.post(f"{BASE_URL}/auth/register", json={
            "username": "admin",
            "password": "password123",
            "email": "admin@securock.com",
            "role": "admin"
        })
        print("Admin registered.")
    except Exception as e:
        print(f"Admin registration skipped or failed: {e}")

def simulate_logs():
    print("Simulating traffic...")
    sources = ["192.168.1.10", "192.168.1.12", "10.0.0.5"]
    events = ["LOGIN_SUCCESS", "FILE_ACCESS", "PROCESS_START", "NETWORK_CONN"]
    
    # Normal Traffic
    for _ in range(10):
        log = {
            "timestamp": "2023-10-27T10:00:00",
            "source_ip": random.choice(sources),
            "host": "server-01",
            "event_type": random.choice(events),
            "message": "Routine operation"
        }
        requests.post(f"{BASE_URL}/ingest/logs", json=log)
        time.sleep(0.2)
    
    print("Sent normal logs.")

    # Attack Simulation
    print("Simulating ATTACK...")
    attack_log = {
        "timestamp": "2023-10-27T10:05:00",
        "source_ip": "192.168.1.100", 
        "host": "database-prod",
        "event_type": "SQL_INJECTION_ATTEMPT", 
        "message": "SELECT * FROM users WHERE '1'='1' --" 
        # Note: Detection logic in detection.py is simple (length/hash), 
        # but let's assume this matches anomaly logic or we update detection to flag this.
        # Current detection.py uses IsolationForest trained on dummy data.
        # It might randomly flag this or not.
    }
    requests.post(f"{BASE_URL}/ingest/logs", json=attack_log)
    print("Sent attack log.")

if __name__ == "__main__":
    if wait_for_services():
        register_admin()
        simulate_logs()
    else:
        print("Services not reachable. Ensure docker-compose is running.")
