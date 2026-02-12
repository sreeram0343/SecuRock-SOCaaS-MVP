# Manual Setup Guide (No Docker)

If you cannot use Docker, follow these steps to run the SecuRock SOC platform manually using Python and local databases.

## Prerequisites

1.  **Python 3.9+** installed.
2.  **PostgreSQL** installed and running locally.
3.  **Redis** installed and running locally.
4.  **Node.js 18+** (for frontend).

---

## 1. Environment Setup

### Database Setup
1.  Create a PostgreSQL database named `securock_db`.
2.  Create a user `securock_user` with password `securock_pass`.
    ```sql
    CREATE USER securock_user WITH PASSWORD 'securock_pass';
    CREATE DATABASE securock_db OWNER securock_user;
    ```

### Redis Setup
Ensure Redis is running on default port `6379`.

---

## 2. Backend Setup

Open a terminal in `backend/` and run:

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r auth_service/requirements.txt
pip install -r ingestion_service/requirements.txt
pip install -r detection_service/requirements.txt
pip install -r alert_service/requirements.txt
pip install uvicorn
```

---

## 3. Running Services

You need to run each service in a **separate terminal window**.

**Terminal 1: Auth Service**
```bash
set DATABASE_URL=postgresql://securock_user:securock_pass@localhost/securock_db
set SECRET_KEY=your_secret_key_here
cd backend/auth_service
uvicorn main:app --port 8001 --reload
```

**Terminal 2: Ingestion Service**
```bash
set REDIS_HOST=localhost
set REDIS_PORT=6379
cd backend/ingestion_service
uvicorn main:app --port 8002 --reload
```

**Terminal 3: Alert Service**
```bash
set DATABASE_URL=postgresql://securock_user:securock_pass@localhost/securock_db
cd backend/alert_service
uvicorn main:app --port 8003 --reload
```

**Terminal 4: Detection Service (Worker)**
```bash
set REDIS_HOST=localhost
set ALERT_SERVICE_URL=http://localhost:8003
cd backend/detection_service
python main.py
```

---

## 4. Frontend Setup

**Terminal 5: Frontend**
```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

The frontend will start at `http://localhost:5173`.

---

## 5. Configuration Notes

Since we are not using Nginx (which handles routing in Docker), you must configure the Frontend to talk directly to the different service ports.

**Edit `frontend/vite.config.js`:**
You may need to set up a proxy to route `/api/auth` to port 8001, `/api/ingest` to 8002, etc., or update the API calls in the frontend code to point to full URLs.

**Recommendation:** Docker is *highly* recommended to avoid this manual port management complexity.
