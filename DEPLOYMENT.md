# SecuRock SOC - Deployment Guide

This guide details how to deploy SecuRock SOC on various infrastructure, from local servers to cloud environments.

## Quick Install (Linux/Ubuntu)

For a standard single-node deployment (e.g., on an AWS EC2 instance or DigitalOcean Droplet), use our automated installer:

```bash
curl -fsSL https://raw.githubusercontent.com/securock/platform/main/install.sh | bash
```

Alternatively, if you have the files locally:

```bash
chmod +x install.sh
./install.sh
```

### Prerequisites
- **OS**: Ubuntu 22.04 LTS (Recommended)
- **RAM**: Minimum 8GB (16GB Recommended for AI processing)
- **Disk**: 50GB SSD
- **Network**: Ports 80, 443, 8000, 5173 (if dev), 9200 (internal)

## Docker Deployment (Manual)

If you prefer to manage the containers yourself:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/securock/platform.git securock
    cd securock
    ```

2.  **Configure Environment**:
    Copy `.env.example` to `.env` and update the values:
    ```bash
    cp .env.example .env
    nano .env
    ```
    *Set `SECRET_KEY`, `POSTGRES_PASSWORD`, `DOMAIN_NAME`.*

3.  **Start Services**:
    ```bash
    docker-compose up -d --build
    ```

4.  **Verify Status**:
    ```bash
    docker-compose ps
    ```

## Cloud Deployment (AWS)

For production scaling:

1.  **Database**: Use AWS RDS for PostgreSQL instead of the container.
2.  **Cache**: Use AWS ElastiCache for Redis.
3.  **Containers**: Deploy backend/worker to ECS or EKS.
4.  **Load Balancer**: Use ALB to route traffic (AWS Certificate Manager for HTTPS).

## Troubleshooting

- **Logs**: View logs with `docker-compose logs -f backend`.
- **Database**: Connect via `docker-compose exec db psql -U postgres`.
- **OpenSearch**: Check health at `curl -k https://localhost:9200`.

## Upgrading

To upgrade to the latest version:

```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```
