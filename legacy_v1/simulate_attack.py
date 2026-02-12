import requests
import time
import random

API_URL = "http://localhost:8000/agent/data"
HEADERS = {"X-API-KEY": "securock-agent-key-123", "Content-Type": "application/json"}

def send_telemetry(cpu, process, file_activity):
    payload = {
        "cpu": cpu,
        "process": process,
        "file_activity": file_activity,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S")
    }
    try:
        resp = requests.post(API_URL, json=payload, headers=HEADERS)
        print(f"Sent: {payload} | Status: {resp.status_code} | Resp: {resp.json()}")
    except Exception as e:
        print(f"Error: {e}")

print("--- Starting Simulation ---")
# 1. Normal Traffic for 5 seconds
print("Sending LOW traffic...")
for _ in range(5):
    send_telemetry(random.randint(10, 30), "System Idle", 0)
    time.sleep(1)

# 2. Attack! (High CPU - Miner)
print("Sending ATTACK traffic (Miner)...")
for _ in range(5):
    send_telemetry(random.randint(90, 100), "xmrig.exe", 0)
    time.sleep(1)

# 3. Attack! (Ransomware)
print("Sending ATTACK traffic (Ransomware)...")
for _ in range(5):
    send_telemetry(random.randint(40, 60), "encryptor.exe", 50)
    time.sleep(1)

print("--- Simulation Complete ---")
