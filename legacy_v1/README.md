# SecuRock: Automated SOC as a Service (SOCaaS)

**Hackathon MVP** - Real-time endpoint monitoring, automated threat detection, and autonomous response.

## Features
- **Real-Time Telemetry**: Agent sends CPU & Process structure every 5s.
- **Automated Detection**: Detects High CPU Usage (>80%) + Suspicious Activity.
- **Autonomous Response**: Automatically "Isolates" system upon high severity threat.
- **Live SOC Dashboard**: Dark-themed UI with real-time alerts.
- **Incident Reporting**: Auto-generates professional incident reports.

---

## 🚀 Quick Start Guide

You need to run the **Backend** (for API & Database) and access the **Frontend** (UI). Optionally, you can run the **Agent** to generate live traffic.

### 1. Prerequisites
- Python 3.9+ installed
- Pip installed

### 2. Installation
Open a terminal in the `SecuRock` root directory:
```bash
pip install -r requirements.txt
```

### 3. Run the Backend (Required)
The backend handles authentication (Login/Register) and stores alerts.
```bash
uvicorn backend.main:app --reload
```
*Server will start at `http://localhost:8000`*

### 4. Open the Frontend
You can open the application in multiple ways:
- **Option A (Simplest)**: Double-click `login.html` or `index.html` in File Explorer.
- **Option B (VS Code)**: Right-click `index.html` -> "Open with Live Server".

**Login Credentials**:
- You can **Register** a new account on the `register.html` page.
- Or use any previously registered credentials.

### 5. Run the Agent (Simulation)
To simulate live traffic and attacks, verify the backend is running, then open a **new terminal** and run:
```bash
python agent/agent.py
```
*This will start sending heartbeats to the dashboard.*

---

## 🎮 Demo / Simulation Controls
With the **Agent** running in a terminal, focus on that terminal window and use these keys to simulate attacks:

| Key | Attack Type | System Response |
| :--- | :--- | :--- |
| **A** | **Crypto Miner** | High CPU alert. System throttles CPU. |
| **B** | **Trojan** | Malicious process alert. System terminating process. |
| **E** | **Ransomware** | File manipulation alert. System locks filesystem. |
| **S** | **Safety Switch** | Stops all simulations and resets state to SAFE. |

---

## 🔧 Troubleshooting

### Login / API Connection Issues
- **Symptoms**: Login button spins forever, or "Network Error".
- **Fix**: Ensure the Backend (`uvicorn backend.main:app`) is running.
- **Note**: The frontend has been patched to work with `file:///` and `127.0.0.1`. If you still have issues, try using `http://localhost:8000` for the backend.

### Database Errors
- If you see database errors, delete the `backend/database.db` file (if it exists) and restart the backend. It will recreate a fresh database.

### Port 8000 in Use
- If `uvicorn` fails to start, another service might be using port 8000. Kill the process or restart your machine.
