# Troubleshooting Guide

This document lists common issues encountered during the setup and deployment of SecuRock and how to resolve them.

## 1. Database Connection Failures (PostgreSQL/SQLite)
### Symptoms
- Backend console prints: `sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) connection to server at "localhost" failed`
- Health check returns `unhealthy`.

### Solutions
- If running locally using SQLite, verify the environment variable `DATABASE_URL` is set correctly:
  - Linux: `export DATABASE_URL="sqlite+aiosqlite:///securock.db"`
  - Windows (PowerShell): `$Env:DATABASE_URL="sqlite+aiosqlite:///securock.db"`
- If using Docker Compose, ensure the Postgres container is healthy by checking:
  ```bash
  docker-compose ps
  ```

## 2. Redis Connection Terminations
### Symptoms
- Backend console outputs: `⚠️ Redis connection failed: ConnectionRefusedError`
- WebSockets fail to receive real-time alerts.

### Solutions
- Start a Redis instance locally using Docker:
  ```bash
  docker run -d -p 6379:6379 redis
  ```
- Check if `REDIS_URL` matches your local/container instance environment configuration.
