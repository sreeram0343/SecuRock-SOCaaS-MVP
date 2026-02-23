#!/bin/bash
set -e

echo "================================================================="
echo " Host Preparation for Wazuh & OpenSearch"
echo "================================================================="

echo "[1/3] Optimizing host kernel for OpenSearch..."
sudo sysctl -w vm.max_map_count=262144

echo "      Persisting vm.max_map_count to /etc/sysctl.conf..."
if ! grep -q "vm.max_map_count=262144" /etc/sysctl.conf; then
    echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf
fi

echo "[2/3] Disabling swap memory to prevent JVM degradation..."
sudo swapoff -a

echo "[3/3] Generating self-signed SSL certificates..."
mkdir -p ./config/wazuh_indexer_ssl_certs

# We need a minimal config to instruct the cert generator
cat << 'EOF' > ./config/certs.yml
nodes:
  - name: wazuh.manager
    ip: 127.0.0.1
  - name: wazuh.indexer
    ip: 127.0.0.1
  - name: wazuh.dashboard
    ip: 127.0.0.1
EOF

if [ -f "generate-certs.yml" ]; then
    echo "      Running wazuh-certs-generator via Docker Compose..."
    docker compose -f generate-certs.yml run --rm generator
else
    echo "      Error: generate-certs.yml not found."
    exit 1
fi

echo "================================================================="
echo " Host setup complete! You can now launch the stack."
echo "================================================================="
