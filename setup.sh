#!/bin/bash

# Setup script for SecuRock SOC MVP

echo "Starting SecuRock SOC MVP Setup..."

# 1. Ensure max_map_count is set (Critical for Elasticsearch/Wazuh Indexer)
# Note: On Windows with Docker Desktop, this might need to be set in WSL2 backend:
# wsl -d docker-desktop sysctl -w vm.max_map_count=262144
if [ "$(uname)" == "Linux" ]; then
    echo "Setting vm.max_map_count..."
    sysctl -w vm.max_map_count=262144
else
    echo "Warning: Not running on native Linux. Ensure Docker Desktop WSL2 backend has vm.max_map_count=262144"
fi

# 2. Create logs directory for mock agent
if [ ! -d "logs_mock" ]; then
    echo "Creating mock logs directory..."
    mkdir logs_mock
fi

# 3. Launch Docker Containers
echo "Launching Docker containers..."
docker compose up -d

echo "Waiting for services to stabilize..."
sleep 10
docker compose ps

echo "SecuRock SOC Infrastructure is initializing."
echo "Wazuh Dashboard will be available at https://localhost:443 (default user: admin/admin)"
echo "Wazuh Indexer at https://localhost:9200"
echo "Setup Complete."
