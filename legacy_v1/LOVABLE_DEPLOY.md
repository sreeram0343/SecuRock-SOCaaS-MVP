# Lovable Deployment Guide (Hybrid Mode)

## Overview
This configuration allows you to host the **Dashboard** publicly on Lovable while keeping the **Backend** private on your laptop. The dashboard connects directly to your `localhost` API.

## ⚠️ Important Browser Note
Since Lovable serves via **HTTPS** and your local backend is **HTTP**, some browsers may block the connection ("Mixed Content").
- **Chrome/Edge**: Often allows `localhost` exceptions.
- **Firefox**: May block it.
- **Fix**: If you see "BACKEND OFFLINE" on Lovable, click the **Shield Icon** in the URL bar and select "Allow Insecure Content" or "Disable Protection" for this site.

## Step 1: Run Local Backend
Keep this running on your laptop during the demo!
```powershell
uvicorn backend.main:app --reload
```

## Step 2: Run Local Agent
Open a new terminal and run the agent to simulate attacks.
```powershell
python agent/agent.py
```

## Step 3: Deploy to Lovable
1. Go to [Lovable.dev](https://lovable.dev) (or your preferred static host).
2. Create a **New Project**.
3. Copy the **entire content** of `index.html`.
4. Paste it into the project's HTML file.
5. **Publish/Deploy**.

## Step 4: Live Demo
1. Open the public Lovable URL on your laptop.
2. Ensure it says **"CONNECTED"** (if "OFFLINE", see Browser Note above).
3. In your **Agent Terminal**, press **[A]** to start an attack.
4. Watch the Lovable Dashboard update **LIVE** with the alert!
