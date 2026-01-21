# SecuRock: Automated SOC as a Service (SOCaaS)

**Hackathon MVP** - Real-time endpoint monitoring, automated threat detection, and autonomous response.

## Features
- **Real-Time Telemetry**: Agent sends CPU & Process structure every 5s.
- **Automated Detection**: Detects High CPU Usage (>80%) + Suspicious Activity.
- **Autonomous Response**: Automatically "Isolates" system upon high severity threat.
- **Live SOC Dashboard**: Dark-themed UI with real-time alerts.
- **Incident Reporting**: Auto-generates professional incident reports.

## Prerequisites
- Python 3.9+
- Pip

## Installation

1. Navigate to the project root:
   ```bash
   cd SecuRock
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## How to Run the Demo

You will need **3 separate terminal windows**.

### Terminal 1: Backend (SOC Server)
**IMPORTANT: Run this from the `SecuRock` root directory.**  
*(Do NOT `cd backend` before running this)*

Start the FastApi backend logic engine:
```bash
uvicorn backend.main:app --reload
```
*Server will start at `http://127.0.0.1:8000`*

### Terminal 2: Dashboard
Simply open the `dashboard/index.html` file in your browser.
- You can double-click it in File Explorer.
- The dashboard will show "SAFE" status initially.

### Terminal 3: Endpoint Agent
Start the monitoring agent:
```bash
python agent/agent.py
```
*The agent will start sending data.*

## Demo Procedure (10 Seconds)

1. **Observe**: Dashboard shows "SAFE" and receives regular heartbeat logs.
## Demo Procedure

1. **Observe**: Dashboard shows "SAFE".
2. **Trigger Attacks** (Focus on Agent Terminal):
    - **Press A**: Simulates **Crypto Miner**.
        - *Watch Dashboard*: "Crypto Mining Attack" alert. System throttles CPU.
    - **Press B**: Simulates **Trojan**.
        - *Watch Dashboard*: "Trojan Execution" alert. System kills process.
    - **Press E**: Simulates **Ransomware**.
        - *Watch Dashboard*: "Ransomware Behavior" alert. System locks filesystem.
    - **Press S**: **Safety Switch**. Instantly stops all simulations and resets state.
3. **Download Report**: Go to dashboard and click "Download" to save the incident log.

## Troubleshooting
- **No Data?**: Ensure Backend is running before Agent.
- **CORS Error?**: Dashboard is just an HTML file, modern browsers might block local file fetches. If so, run python simple server in dashboard folder: `python -m http.server 8080`.
- **Database Locked?**: Delete `backend/database.db` to reset.
