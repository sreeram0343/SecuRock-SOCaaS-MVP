
# SecuRock SOC - AI-Powered Security Operations Center

SecuRock's SOC is a completely AI-powered Security Operations Center as a Service. It is a lightweight, cloud-based, next-gen SOC system designed to detect, alert, and respond to all types of cyber attacks.

## Features

- **Multi-Tenant Architecture**: Organization-based data isolation.
- **Real-Time Dashboard**: Live alerts and incident tracking.
- **AI-Powered Detection**: Isolation Forest model for anomaly detection.
- **Incident Management**: Kanban-style incident board.
- **Automated Response**: Playbook system for rule-based actions.

## Tech Stack

- **Backend**: FastAPI, Async PostgreSQL, SQLAlchemy, Pydantic, Redis.
- **Frontend**: React 18, Vite, TypeScript, TailwindCSS, Zustand.
- **ML**: Scikit-Learn, Pandas.
- **Infrastructure**: Docker, Nginx.

## Quick Start (Automated)

The easiest way to get started is using the installation script:

```bash
./install.sh
```
This will check for Docker, generate a `.env` file, and start all services.

## Manual Run Instructions

### 1. Prerequisites
-   **Docker & Docker Compose** (Recommended for full stack)
-   **Python 3.10+** (For local backend/AI)
-   **Node.js 18+** (For local frontend)

### 2. Run with Docker (Production-Ready)
To run the full stack (Backend, Frontend, DB, Redis, OpenSearch, Worker):

```bash
docker-compose up -d --build
```
-   **Dashboard**: [http://localhost:5173](http://localhost:5173)
-   **API**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Local Development

#### Backend & AI Services
```bash
cd backend
# Install dependencies
pip install -r requirements.txt
pip install langchain-experimental # For AI Analyst

# Run Database (if not using Docker)
# Or configure valid DATABASE_URL in .env

# Start API
uvicorn app.main:app --reload --port 8000
```

#### Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```

### 4. Special Features

#### AI Analyst (NLP-to-SQL)
Query your security data using natural language.
1.  **Setup**: `python backend/ai_analyst_setup.py` (Seeds sample data if DB is empty)
2.  **Run**: `python backend/ai_analyst_poc.py` (Requires `OPENAI_API_KEY`)

#### Real-time Attack Map
-   Navigate to the **Overview** page on the dashboard.
-   The map visualizes live threats (mock data in dev, real IPs in prod).

## API Documentation
Once backend is running, visit: `http://localhost:8000/docs`

## Licensing
Proprietary - SecuRock Inc.
