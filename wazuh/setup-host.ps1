# =================================================================
# Host Preparation for Wazuh & OpenSearch (Windows/Docker Desktop)
# =================================================================
$ErrorActionPreference = "Stop"

Write-Host "================================================================="
Write-Host " Host Preparation for Wazuh & OpenSearch on Windows"
Write-Host "================================================================="

Write-Host "[1/3] Optimizing Docker Desktop WSL2 Kernel for OpenSearch..."

# We need to run the sysctl command inside the WSL distribution that Docker Desktop uses.
# Check if wsl.exe is available
if (Get-Command "wsl.exe" -ErrorAction SilentlyContinue) {
    # Typically Docker Desktop runs its own managed distro "docker-desktop"
    Write-Host "      Applying vm.max_map_count to WSL2..."
    wsl.exe -d docker-desktop -e sysctl -w vm.max_map_count=262144
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Failed to set vm.max_map_count in the docker-desktop WSL distribution. You might need to set this manually in your .wslconfig or wait to see if the container starts successfully."
    } else {
        Write-Host "      Successfully applied vm.max_map_count to WSL2."
    }
} else {
    Write-Warning "WSL not found. If you are not using Docker Desktop with WSL2 backend, you may need to apply kernel parameters manually."
}

Write-Host "[2/3] Skipping swap memory configuration (handled by WSL/Windows natively)..."

Write-Host "[3/3] Generating self-signed SSL certificates..."
$certDir = Join-Path -Path $PWD -ChildPath "config\wazuh_indexer_ssl_certs"
if (-not (Test-Path -Path $certDir)) {
    New-Item -ItemType Directory -Path $certDir | Out-Null
}

$certsConfigPath = Join-Path -Path $PWD -ChildPath "config\certs.yml"

# We need a minimal config to instruct the cert generator
$certsYamlContent = @"
nodes:
  - name: wazuh.manager
    ip: 127.0.0.1
  - name: wazuh.indexer
    ip: 127.0.0.1
  - name: wazuh.dashboard
    ip: 127.0.0.1
"@

Set-Content -Path $certsConfigPath -Value $certsYamlContent

if (Test-Path -Path "generate-certs.yml") {
    Write-Host "      Running wazuh-certs-generator via Docker Compose..."
    docker compose -f generate-certs.yml run --rm generator
} else {
    Write-Error "generate-certs.yml not found in the current directory."
    exit 1
}

Write-Host "================================================================="
Write-Host " Host setup complete! You can now launch the stack."
Write-Host "================================================================="
