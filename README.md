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

## Deployment Framework (Hybrid Architecture)
This project is designed for a **Hybrid Demo Deployment**:
- **Frontend** (Dashboard): Hosted publicly on **GitHub Pages**.
- **Backend & Agent**: Hosted locally on your laptop (`localhost`).
- **Telemetry**: The public dashboard fetches data from your local backend via browser-side `fetch()` requests (CORS enabled).

### 1. Web Deployment (GitHub Pages)
1. Push this code to GitHub.
2. Go to **Settings > Pages**.
3. Set **Source** to `main` branch and `/root` folder.
4. Your SOC Dashboard is now live at `https://<username>.github.io/<repo-name>`.

### 2. Local Backend Run
You MUST keep the backend running on your laptop for the dashboard to show data.
```bash
uvicorn backend.main:app --reload
```
*The public dashboard will connect to this local instance automatically.*

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
- **Lovable / GitHub Pages "OFFLINE"**: 
  - If hosting online but connecting to localhost, your browser might block "Mixed Content" (HTTPS -> HTTP).
  - **Fix**: Click the **Shield/Lock Icon** in your browser URL bar > **Site Settings** > **Allow Insecure Content** (or "Disable Protection for this site").
- **No Data?**: Ensure Backend is running before Agent.
- **Port In Use?**: Kill existing python processes or change port in `main.py`.
- **Git Error?**: Install Git from [git-scm.com](https://git-scm.com).

