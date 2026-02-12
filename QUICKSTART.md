# SecuRock SOC - Quick Start Guide

## Current Status

✅ **Completed:**
- Microservices architecture implemented
- Backend services (Auth, Ingestion, Detection, Alert)
- AI anomaly detection with Isolation Forest
- React dashboard with real-time WebSocket updates
- Docker Compose infrastructure
- Comprehensive development plan

## Prerequisites

Before running the platform, ensure you have:
- **Docker Desktop** installed and running
- **Python 3.9+** (for setup scripts)
- **Git** (for version control)

## Step-by-Step Deployment

### 1. Navigate to Infrastructure Directory

```bash
cd infrastructure
```

### 2. Start All Services

```bash
docker compose up --build -d
```

**What this does:**
- Builds Docker images for all microservices
- Starts PostgreSQL, Elasticsearch, Redis
- Launches Auth, Ingestion, Detection, and Alert services
- Starts Nginx reverse proxy
- Launches React frontend

**Expected time:** 5-10 minutes on first run (downloading images)

### 3. Monitor Service Health

Check if all services are running:

```bash
docker compose ps
```

You should see all services in "Up" state.

View logs for any service:

```bash
docker compose logs -f [service_name]
# Example: docker compose logs -f detection_service
```

### 4. Initialize Demo Data

Open a new terminal and run:

```bash
cd ..
pip install requests
python scripts/setup_demo.py
```

**What this does:**
- Waits for all services to be ready
- Registers an admin user (`admin` / `password123`)
- Sends sample security logs
- Simulates a security event

### 5. Access the Dashboard

Open your browser and navigate to:

```
http://localhost
```

**Login credentials:**
- Username: `admin`
- Password: `password123`

## Troubleshooting

### Issue: Services won't start

**Solution:**
```bash
# Stop all services
docker compose down

# Remove volumes (fresh start)
docker compose down -v

# Rebuild and start
docker compose up --build -d
```

### Issue: Port conflicts

**Solution:**
Check if ports 80, 5432, 9200, or 6379 are already in use:

```bash
# Windows
netstat -ano | findstr :80
netstat -ano | findstr :5432

# Kill the process or change ports in docker-compose.yml
```

### Issue: Frontend not loading

**Solution:**
```bash
# Check frontend logs
docker compose logs frontend

# Rebuild frontend only
docker compose up --build frontend
```

### Issue: No alerts appearing

**Solution:**
1. Check if detection service is running:
   ```bash
   docker compose logs detection_service
   ```

2. Manually send a test log:
   ```bash
   curl -X POST http://localhost/api/ingest/logs \
     -H "Content-Type: application/json" \
     -d '{
       "timestamp": "2024-02-04T12:00:00",
       "source_ip": "192.168.1.100",
       "host": "test-server",
       "event_type": "SUSPICIOUS_ACTIVITY",
       "message": "Test security event"
     }'
   ```

## Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Dashboard** | http://localhost | Main UI |
| **API Gateway** | http://localhost/api | All backend APIs |
| **Auth API** | http://localhost/api/auth/docs | Authentication endpoints |
| **Ingestion API** | http://localhost/api/ingest/docs | Log ingestion |
| **Alert API** | http://localhost/api/alerts/docs | Alert management |
| **Elasticsearch** | http://localhost:9200 | Direct log search |
| **PostgreSQL** | localhost:5432 | Database access |

## Development Workflow

### Making Changes

1. **Backend changes:**
   ```bash
   # Edit files in backend/[service_name]/
   # Rebuild specific service
   docker compose up --build [service_name]
   ```

2. **Frontend changes:**
   ```bash
   # Edit files in frontend/src/
   # Hot reload is enabled, changes appear automatically
   ```

### Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f alert_service

# Last 100 lines
docker compose logs --tail=100 detection_service
```

### Stopping Services

```bash
# Stop all services (keeps data)
docker compose down

# Stop and remove all data
docker compose down -v
```

## Next Steps

### For Development:
1. Review the [Development Plan](docs/DEVELOPMENT_PLAN.md)
2. Check the [Architecture Documentation](docs/DEVELOPMENT_PLAN.md#2-system-architecture-design)
3. Explore the API documentation at http://localhost/api/auth/docs

### For Pilot Deployment:
1. Review [Pilot Deployment Strategy](docs/DEVELOPMENT_PLAN.md#9-pilot-deployment-strategy)
2. Prepare customer onboarding materials
3. Set up monitoring and alerting

### For Investors:
1. Review [Investor Readiness Checklist](docs/DEVELOPMENT_PLAN.md#11-investor-readiness-checklist)
2. Prepare demo environment
3. Collect pilot customer testimonials

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    USERS / ANALYSTS                      │
│                          ↓                               │
│              ┌───────────────────────┐                   │
│              │   React Dashboard     │                   │
│              │   (Port 80 via Nginx) │                   │
│              └───────────┬───────────┘                   │
│                          ↓                               │
│              ┌───────────────────────┐                   │
│              │    Nginx Gateway      │                   │
│              │  - Routing            │                   │
│              │  - Load Balancing     │                   │
│              └───────────┬───────────┘                   │
│                          ↓                               │
│    ┌─────────────────────┼─────────────────────┐        │
│    ↓                     ↓                     ↓        │
│ ┌──────┐           ┌──────────┐          ┌────────┐     │
│ │ Auth │           │Ingestion │          │ Alert  │     │
│ │Service│          │ Service  │          │Service │     │
│ └──┬───┘           └────┬─────┘          └───┬────┘     │
│    ↓                    ↓                    ↑          │
│ ┌──────────┐       ┌─────────┐         ┌────────────┐   │
│ │PostgreSQL│       │  Redis  │         │ Detection  │   │
│ │          │       │  Queue  │         │  Service   │   │
│ └──────────┘       └────┬────┘         │  (AI/ML)   │   │
│                         ↓               └─────┬──────┘   │
│                    ┌─────────────┐           ↓          │
│                    │Normalization│     ┌──────────────┐  │
│                    │   Service   │     │Elasticsearch │  │
│                    └─────────────┘     │  (Log Store) │  │
│                                        └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Support

For issues or questions:
1. Check the logs: `docker compose logs [service]`
2. Review the [Development Plan](docs/DEVELOPMENT_PLAN.md)
3. Check service health: `docker compose ps`

---

**Built by SecuRock Technologies**  
**Founder:** Sreeram M R  
**Version:** MVP 1.0
