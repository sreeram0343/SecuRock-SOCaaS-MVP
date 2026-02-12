#!/bin/bash

# SecuRock SOC - Installation Script
# Usage: ./install.sh

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   SecuRock SOC - Installation Setup   ${NC}"
echo -e "${BLUE}=========================================${NC}"

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "Docker could not be found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
else
    echo -e "${GREEN}✓ Docker is installed${NC}"
fi

# Check for Docker Compose
if ! command -v docker-compose &> /dev/null; then
     # Try 'docker compose' plugin
    if docker compose version &> /dev/null; then
        echo -e "${GREEN}✓ Docker Compose (Plugin) is installed${NC}"
    else
        echo "Installing Docker Compose..."
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
else
    echo -e "${GREEN}✓ Docker Compose is installed${NC}"
fi

# Clone Repository (if not already in it)
# In a real distribution, this might pull a standardized release or use just the docker-compose.yml
if [ ! -f "docker-compose.yml" ]; then
    echo "Downloading configuration..."
    # Placeholder for fetching docker-compose.yml from release artifact
    # curl -O https://raw.githubusercontent.com/securock/platform/main/docker-compose.yml
fi

# Configuration Setup
if [ ! -f ".env" ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cp .env.example .env 2>/dev/null || touch .env
    
    # Prompt for key variables
    read -p "Enter Domain Name (e.g., soc.example.com): " DOMAIN_NAME
    read -p "Enter Admin Email: " ADMIN_EMAIL
    
    echo "DOMAIN_NAME=$DOMAIN_NAME" >> .env
    echo "ADMIN_EMAIL=$ADMIN_EMAIL" >> .env
    
    # Generate Secrets
    SECRET_KEY=$(openssl rand -hex 32)
    echo "SECRET_KEY=$SECRET_KEY" >> .env
    echo "POSTGRES_PASSWORD=$(openssl rand -hex 16)" >> .env
fi

# Start Services
echo -e "${BLUE}Starting SecuRock Services...${NC}"
# Use correct compose command
if command -v docker-compose &> /dev/null; then
    docker-compose up -d --build
else
    docker compose up -d --build
fi

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   Installation Complete!   ${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "Access the Dashboard at: http://localhost:5173 (or your server IP)"
echo -e "API Documentation at: http://localhost:8000/docs"
