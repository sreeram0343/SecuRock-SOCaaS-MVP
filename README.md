# SecuRock SOCaaS Platform

SecuRock is an enterprise-grade, multi-tenant Security Operations Center as a Service (SOCaaS) platform. It unifies high-fidelity threat detection, AI-driven incident analysis, and a modern client portal tailored for direct-to-enterprise and Managed Service Provider (MSP) engagements.

## 🚀 Architecture Overview

SecuRock operates on a robust, scalable microservices architecture built for heavy telemetry ingestion and low-latency analysis.

*   **Frontend (Next.js 14):** A unified enterprise website and authenticated client dashboard. Built with React (App Router), Tailwind CSS, Shadcn UI, and Zustand. Real-time alert streaming via WebSockets.
*   **Backend (FastAPI):** High-performance asynchronous API handling RBAC, multi-tenancy, and alert routing. Uses `bcrypt` for secure authentication and HttpOnly cookies for JWT refresh tokens.
*   **Database (PostgreSQL 15):** Relational store for users, organizations, alert metadata, and incident tracking, accessed via SQLAlchemy and asyncpg.
*   **Message Broker (Redis):** Handles asynchronous task queuing and websocket pub/sub for real-time dashboard events.
*   **Search Engine (OpenSearch):** Stores raw telemetry data and detailed AI evaluations for fast querying and dashboard analytics.
*   **Analytics Engine (Scikit-Learn & OpenAI):**
    *   **ML Service:** Uses an `Isolation Forest` model to score telemetry anomalies and block automated threats.
    *   **AI Service:** Leverages OpenAI models via LangChain to generate structured incident narratives (Executive Summary, Technical Analysis, Remediation).
*   **Infrastructure (Docker & Nginx):** Containerized deployment managed by Docker Compose, with Nginx acting as the reverse proxy for seamless API/WebSocket routing.
*   **SIEM Integration (Wazuh):** Centralized log aggregation and threat intelligence feed integration.

## 🛠️ Tech Stack

*   **Languages:** Python 3.11+, TypeScript, SQL
*   **Frameworks:** FastAPI, Next.js 14, React 18, Tailwind CSS
*   **Data Stores:** PostgreSQL, Redis, OpenSearch
*   **AI/ML:** Scikit-Learn (Isolation Forest), LangChain, OpenAI API
*   **Infrastructure:** Docker, Docker Compose, Nginx, Wazuh

## 📦 Getting Started (Local Development)

### Prerequisites

*   Docker engine and Docker Compose installed
*   Node.js 20+ (for local frontend development without Docker)
*   Python 3.11+ (for local backend development without Docker)
*   An OpenAI API Key

### 1. Environment Setup

Copy the environment template and fill in your secrets:

```bash
cp .env.example .env
```

Ensure you add your `OPENAI_API_KEY` to the `.env` file for the AI generation features to function correctly.

### 2. Bootstrapping the Platform

You can launch the entire stack (Database, Cache, Search, API, Frontend, Nginx proxy) using a single command:

```bash
docker-compose up --build -d
```

### 3. Accessing the Services

*   **SecuRock Web Platform:** `http://localhost` (Routes to Next.js)
*   **Backend API Documentation (SwaggerUI):** `http://localhost/docs` (Proxied via Nginx to FastAPI)
*   **Direct API Access:** `http://localhost/api/*`

## 🔒 Security Posture

*   **Authentication:** Dual-token JWT architecture. Access tokens (short-lived) in memory, Refresh tokens (long-lived) in secure HttpOnly cookies.
*   **Authorization:** Role-Based Access Control (RBAC) enforced via FastAPI dependencies per endpoint.
*   **Multi-Tenancy:** Hardened logical separation via `organization_id` bindings across all relational tables.
*   **Passwords:** Salted and hashed using `bcrypt` (Passlib).

## 🗂️ Project Structure

```
securock-platform/
├── backend/                # FastAPI application
│   ├── app/                # Application code (API, models, services, workers)
│   ├── models/             # Trained ML models (.joblib)
│   ├── tests/              # Pytest battery
│   └── requirements.txt    # Python dependencies
├── frontend_next/          # Next.js 14 application
│   ├── src/app/            # App router pages (Landing, Dashboard, Auth)
│   ├── src/components/     # Reusable UI elements (Shadcn, Charts)
│   ├── src/store/          # Zustand state management
│   └── tailwind.config.ts  # Tailwind custom design system
├── infra/                  # Infrastructure configurations
│   └── nginx/              # Nginx reverse proxy routing
├── shared/                 # Shared resources (schemas, constants)
├── docker-compose.yml      # Orchestration definition
└── .env.example            # Environment variables template
```

## 🤝 Contributing
For internal teams, follow the standard feature-branch workflow. Ensure all backend PRs pass the `pytest` suite and frontend code clears `eslint`.
