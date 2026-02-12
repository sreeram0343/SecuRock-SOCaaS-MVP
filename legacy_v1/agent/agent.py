import time
import requests
import psutil
import json
import random
import os
import msvcrt 
import threading
import shutil

# CONFIGURATION
BACKEND_URL = "http://localhost:8000/agent/data"
API_KEY = "securock-agent-key-123" # Must match backend expectation
HEADERS = {"X-API-KEY": API_KEY, "Content-Type": "application/json"}

# Global State for Attack Simulation
class AttackState:
    cpu_hijack = False
    trojan_active = False
    ransomware_active = False
    
    # Details
    current_cpu = 0
    current_process = "System Idle"
    file_activity_rate = 0

state = AttackState()

def cpu_hijack_loop():
    """Simulate High CPU Load"""
    print("[THREAD] CPU Hijack Thread Started...")
    while state.cpu_hijack:
        _ = 999999 ** 999
        time.sleep(0.01)
    print("[THREAD] CPU Hijack Thread Stopped.")

def trojan_loop():
    """Simulate Persistent Trojan Process"""
    print("[THREAD] Trojan Process Simulation Started...")
    state.current_process = "evil_process_sim.py"
    while state.trojan_active:
        time.sleep(1)
    state.current_process = "System Idle"
    print("[THREAD] Trojan Process Stopped.")

def ransomware_loop():
    """Simulate Rapid File Creation"""
    print("[THREAD] Ransomware File Burst Started...")
    temp_dir = "./temp_ransom"
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
        
    count = 0
    while state.ransomware_active:
        state.file_activity_rate = random.randint(30, 80)
        with open(f"{temp_dir}/encrypt_{count}.locked", "w") as f:
            f.write("YOUR FILES ARE ENCRYPTED")
        count += 1
        time.sleep(0.1)
    
    state.file_activity_rate = 0
    if os.path.exists(temp_dir):
        try:
            shutil.rmtree(temp_dir)
        except:
            pass
    print("[THREAD] Ransomware Stopped & Cleaned up.")

# Attack Triggers
def start_cpu_attack():
    if not state.cpu_hijack:
        state.cpu_hijack = True
        state.current_cpu = 99
        t = threading.Thread(target=cpu_hijack_loop)
        t.daemon = True
        t.start()
        print("\n[!] ATTACK STARTED: CPU Hijack (Miner)")

def start_trojan():
    if not state.trojan_active:
        state.trojan_active = True
        t = threading.Thread(target=trojan_loop)
        t.daemon = True
        t.start()
        print("\n[!] ATTACK STARTED: Trojan Execution")

def start_ransomware():
    if not state.ransomware_active:
        state.ransomware_active = True
        t = threading.Thread(target=ransomware_loop)
        t.daemon = True
        t.start()
        print("\n[!] ATTACK STARTED: Ransomware Burst")

def stop_all():
    print("\n[mitigation] STOPPING ALL ATTACKS...")
    state.cpu_hijack = False
    state.trojan_active = False
    state.ransomware_active = False
    state.current_cpu = 0
    state.file_activity_rate = 0
    state.current_process = "System Idle"

    # Notify Backend to Reset
    try:
        requests.delete(f"{BACKEND_URL.replace('/agent/data', '/alerts')}", headers=HEADERS, timeout=2)
        print("    >>> SOC ALERT HISTORY CLEARED")
    except:
        print("    [!] Failed to clear backend alerts")

def get_metrics():
    if state.cpu_hijack:
        cpu = random.randint(85, 99)
        process = "xmrig_miner.exe"
    elif state.trojan_active:
        cpu = random.randint(10, 30)
        process = "evil_process_sim.py"
    elif state.ransomware_active:
        cpu = random.randint(40, 60)
        process = "encryptor_v2.exe"
    else:
        cpu = psutil.cpu_percent(interval=None)
        process = "System Idle"
    
    return cpu, process

def handle_backend_response(resp):
    action = resp.get("action")
    if action == "THROTTLE_CPU" and state.cpu_hijack:
        print("[SOC COMMAND] Received CPU Kill Switch. Stopping Miner...")
        state.cpu_hijack = False
    
    if action == "KILL_PROCESS" and state.trojan_active:
        print("[SOC COMMAND] Received Kill Process. Terminating Trojan...")
        state.trojan_active = False
        
    if action == "LOCK_FILESYSTEM" and state.ransomware_active:
        print("[SOC COMMAND] Received Lockdown. Stopping File Activity...")
        state.ransomware_active = False

def main():
    print("[-] SecuRock Agent Protected v3.0")
    print("[-] Auth Method: API Key (AES-256)")
    print("===========================================")
    print("[A] Start CPU Hijack (Miner)")
    print("[B] Start Trojan Process")
    print("[E] Start Ransomware Burst")
    print("[S] STOP ALL / RESET")
    print("===========================================")
    
    psutil.cpu_percent(interval=None)

    while True:
        try:
            if msvcrt.kbhit():
                key = msvcrt.getch().lower()
                if key == b'a': start_cpu_attack()
                elif key == b'b': start_trojan()
                elif key == b'e': start_ransomware()
                elif key == b's': stop_all()

            cpu, process = get_metrics()
            
            payload = {
                "cpu": cpu,
                "process": process,
                "file_activity": state.file_activity_rate,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S")
            }
            
            # Send with API Headers
            resp = requests.post(BACKEND_URL, json=payload, headers=HEADERS, timeout=5)
            
            if resp.status_code == 200:
                data = resp.json()
                if data.get("status") in ["ISOLATED", "WARNING", "THREAT_DETECTED"]:
                     print(f"    >>> SOC ALERT: {data.get('action')}")
                     handle_backend_response(data)
            elif resp.status_code == 403:
                print("\n[CRITICAL] AUTHENTICATION FAILED. CHECK API KEY.")
            
            log_icon = "✔️"
            if state.cpu_hijack or state.trojan_active or state.ransomware_active:
                log_icon = "⚠️"
            
            print(f"[{log_icon}] CPU: {cpu}% | Proc: {process} | Files: {state.file_activity_rate}/s", end="\r")
            
        except requests.exceptions.ConnectionError:
            print("\n[!] Connection Lost to SOC Backend. Retrying...", end="\r")
        except Exception as e:
            # print(f"\n[X] Error: {e}")
            pass
        
        time.sleep(1)

if __name__ == "__main__":
    main()
