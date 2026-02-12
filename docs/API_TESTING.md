# API Testing Guide

## Testing the SecuRock SOC APIs

This guide provides curl commands and examples for testing all API endpoints.

## 1. Authentication Service

### Register a New User

```bash
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "analyst1",
    "password": "securepass123",
    "email": "analyst1@securock.com",
    "role": "analyst"
  }'
```

### Login and Get Token

```bash
curl -X POST http://localhost/api/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=password123"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Save the token for subsequent requests:**
```bash
export TOKEN="your_access_token_here"
```

### Get Current User Info

```bash
curl -X GET http://localhost/api/auth/users/me \
  -H "Authorization: Bearer $TOKEN"
```

## 2. Log Ingestion Service

### Send a Single Log

```bash
curl -X POST http://localhost/api/ingest/logs \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2024-02-04T12:00:00",
    "source_ip": "192.168.1.50",
    "host": "web-server-01",
    "event_type": "LOGIN_SUCCESS",
    "message": "User admin logged in successfully",
    "details": {
      "username": "admin",
      "session_id": "abc123"
    }
  }'
```

### Send Multiple Logs (Batch)

```bash
# Normal activity
for i in {1..10}; do
  curl -X POST http://localhost/api/ingest/logs \
    -H "Content-Type: application/json" \
    -d "{
      \"timestamp\": \"2024-02-04T12:0$i:00\",
      \"source_ip\": \"192.168.1.$((RANDOM % 50 + 1))\",
      \"host\": \"server-0$((RANDOM % 5 + 1))\",
      \"event_type\": \"FILE_ACCESS\",
      \"message\": \"File accessed: /var/log/app.log\"
    }"
  sleep 0.5
done
```

### Simulate Attack Scenarios

**Brute Force Attack:**
```bash
for i in {1..20}; do
  curl -X POST http://localhost/api/ingest/logs \
    -H "Content-Type: application/json" \
    -d '{
      "timestamp": "2024-02-04T12:05:00",
      "source_ip": "203.0.113.100",
      "host": "auth-server",
      "event_type": "LOGIN_FAILED",
      "message": "Failed login attempt for user admin"
    }'
  sleep 0.2
done
```

**Suspicious Data Transfer:**
```bash
curl -X POST http://localhost/api/ingest/logs \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2024-02-04T12:10:00",
    "source_ip": "192.168.1.100",
    "host": "file-server",
    "event_type": "DATA_TRANSFER",
    "message": "Large file transfer detected: 5GB to external IP",
    "details": {
      "bytes_transferred": 5368709120,
      "destination": "203.0.113.50",
      "protocol": "FTP"
    }
  }'
```

**Privilege Escalation:**
```bash
curl -X POST http://localhost/api/ingest/logs \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2024-02-04T12:15:00",
    "source_ip": "192.168.1.75",
    "host": "domain-controller",
    "event_type": "PRIVILEGE_CHANGE",
    "message": "User elevated to administrator",
    "details": {
      "username": "jdoe",
      "previous_role": "user",
      "new_role": "administrator"
    }
  }'
```

## 3. Alert Service

### Get All Alerts

```bash
curl -X GET http://localhost/api/alerts/alerts
```

### Get Alerts with Pagination

```bash
curl -X GET "http://localhost/api/alerts/alerts?skip=0&limit=10"
```

### Create Alert Manually

```bash
curl -X POST http://localhost/api/alerts/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Manual Test Alert",
    "description": "Testing alert creation via API",
    "severity": "MEDIUM",
    "source_ip": "192.168.1.200",
    "status": "OPEN",
    "timestamp": "2024-02-04T12:20:00"
  }'
```

### WebSocket Connection (JavaScript)

```javascript
// Connect to WebSocket for real-time alerts
const ws = new WebSocket('ws://localhost/api/alerts/ws/alerts');

ws.onopen = () => {
  console.log('Connected to alert stream');
};

ws.onmessage = (event) => {
  console.log('New alert:', event.data);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};
```

## 4. Health Checks

### Check Ingestion Service Health

```bash
curl -X GET http://localhost/api/ingest/health
```

**Expected Response:**
```json
{
  "redis": "ok"
}
```

### Check All Services

```bash
# Auth Service
curl -X GET http://localhost/api/auth/docs

# Ingestion Service
curl -X GET http://localhost/api/ingest/docs

# Alert Service
curl -X GET http://localhost/api/alerts/docs
```

## 5. Complete Test Workflow

### End-to-End Test Script

```bash
#!/bin/bash

echo "=== SecuRock SOC API Test ==="

# 1. Register user
echo "1. Registering test user..."
curl -s -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123",
    "email": "test@securock.com",
    "role": "analyst"
  }' | jq

# 2. Login
echo "2. Logging in..."
TOKEN=$(curl -s -X POST http://localhost/api/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=password123" | jq -r '.access_token')

echo "Token: $TOKEN"

# 3. Send logs
echo "3. Sending test logs..."
for i in {1..5}; do
  curl -s -X POST http://localhost/api/ingest/logs \
    -H "Content-Type: application/json" \
    -d "{
      \"timestamp\": \"2024-02-04T12:00:0$i\",
      \"source_ip\": \"192.168.1.$i\",
      \"host\": \"test-server\",
      \"event_type\": \"TEST_EVENT\",
      \"message\": \"Test log entry $i\"
    }" > /dev/null
done

echo "Sent 5 test logs"

# 4. Wait for processing
echo "4. Waiting for detection..."
sleep 5

# 5. Check alerts
echo "5. Checking alerts..."
curl -s -X GET http://localhost/api/alerts/alerts | jq

echo "=== Test Complete ==="
```

## 6. Performance Testing

### Load Test with Apache Bench

```bash
# Install Apache Bench (if not installed)
# Windows: Download from Apache website
# Linux: apt-get install apache2-utils

# Test ingestion endpoint
ab -n 1000 -c 10 -p log.json -T application/json \
  http://localhost/api/ingest/logs
```

**log.json:**
```json
{
  "timestamp": "2024-02-04T12:00:00",
  "source_ip": "192.168.1.1",
  "host": "test",
  "event_type": "TEST",
  "message": "Load test"
}
```

### Measure Detection Latency

```bash
#!/bin/bash

START=$(date +%s%N)

# Send log
curl -s -X POST http://localhost/api/ingest/logs \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2024-02-04T12:00:00",
    "source_ip": "192.168.1.1",
    "host": "test",
    "event_type": "TEST",
    "message": "Latency test"
  }' > /dev/null

# Wait and check for alert
sleep 2
ALERTS=$(curl -s http://localhost/api/alerts/alerts)

END=$(date +%s%N)
LATENCY=$(( ($END - $START) / 1000000 ))

echo "Detection latency: ${LATENCY}ms"
```

## 7. Troubleshooting API Issues

### Check if services are running

```bash
curl -v http://localhost/api/auth/docs
curl -v http://localhost/api/ingest/health
curl -v http://localhost/api/alerts/alerts
```

### View service logs

```bash
# From infrastructure directory
docker compose logs -f ingestion_service
docker compose logs -f detection_service
docker compose logs -f alert_service
```

### Test Redis connectivity

```bash
docker compose exec redis redis-cli ping
# Expected: PONG
```

### Test PostgreSQL connectivity

```bash
docker compose exec postgres psql -U securock_user -d securock_db -c "SELECT 1;"
# Expected: 1
```

### Test Elasticsearch

```bash
curl http://localhost:9200/_cluster/health
```

## 8. Common Issues

### Issue: 401 Unauthorized

**Cause:** Invalid or expired token

**Solution:**
```bash
# Get a new token
TOKEN=$(curl -s -X POST http://localhost/api/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=password123" | jq -r '.access_token')
```

### Issue: 500 Internal Server Error

**Cause:** Service error or database connection issue

**Solution:**
```bash
# Check service logs
docker compose logs [service_name]

# Restart the service
docker compose restart [service_name]
```

### Issue: Connection refused

**Cause:** Service not running or wrong port

**Solution:**
```bash
# Check running services
docker compose ps

# Restart all services
docker compose restart
```

---

**For more information, see:**
- [Quick Start Guide](QUICKSTART.md)
- [Development Plan](docs/DEVELOPMENT_PLAN.md)
