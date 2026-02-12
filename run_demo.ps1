$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   SecuRock SOC - One-Click Auto Setup    " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Check Prerequisites
Write-Host "`n[1/5] Checking Prerequisites..." -ForegroundColor Yellow
try {
    python --version
} catch {
    Write-Error "Python is not installed. Please install Python 3.9+ and try again."
    exit 1
}

# 2. Setup Python Virtual Environment
Write-Host "`n[2/5] Setting up Python Environment..." -ForegroundColor Yellow
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
}
Write-Host "Activating venv..."
& .\venv\Scripts\Activate.ps1

Write-Host "Installing dependencies (this may take a minute)..."
pip install -r backend/auth_service/requirements.txt | Out-Null
pip install -r backend/ingestion_service/requirements.txt | Out-Null
pip install -r backend/detection_service/requirements.txt | Out-Null
pip install -r backend/alert_service/requirements.txt | Out-Null
pip install uvicorn requests sqlalchemy redis passlib python-jose python-multipart multipart | Out-Null

# 3. Configure Database (SQLite Fallback)
Write-Host "`n[3/5] Configuring Databases..." -ForegroundColor Yellow
$Env:DATABASE_URL = "sqlite:///./securock.db"
# Warning: Redis is still required. 
# We'll assume localhost:6379. If not present, Ingestion/Detection will fail gracefully or retry.
$Env:REDIS_HOST = "localhost"
$Env:REDIS_PORT = "6379"
$Env:SECRET_KEY = "demo-secret-key"
$Env:ALERT_SERVICE_URL = "http://localhost:8003"

Write-Host "Using SQLite database: $Env:DATABASE_URL"

# 4. Start Services
Write-Host "`n[4/5] Launching Backend Services..." -ForegroundColor Yellow

$services = @(
    @{ Name="Auth"; Path="backend/auth_service"; Port=8001 },
    @{ Name="Ingest"; Path="backend/ingestion_service"; Port=8002 },
    @{ Name="Alert"; Path="backend/alert_service"; Port=8003 }
)

foreach ($svc in $services) {
    Write-Host "Starting $($svc.Name) Service on port $($svc.Port)..."
    Start-Process -FilePath "venv\Scripts\uvicorn.exe" -ArgumentList "main:app --port $($svc.Port) --reload" -WorkingDirectory "$PWD\$($svc.Path)" -WindowStyle Minimized
}

Write-Host "Starting Detection Worker..."
Start-Process -FilePath "venv\Scripts\python.exe" -ArgumentList "main.py" -WorkingDirectory "$PWD\backend\detection_service" -WindowStyle Minimized

# 5. Frontend Setup
Write-Host "`n[5/5] Setting up Frontend..." -ForegroundColor Yellow
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Set-Location frontend
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing npm packages..."
        npm install | Out-Null
    }
    Write-Host "Starting Frontend..."
    Start-Process npm -ArgumentList "run dev" -WorkingDirectory "$PWD"
    Set-Location ..
} else {
    Write-Warning "Node.js (npm) not found. Frontend will not start."
    Write-Warning "You can access the APIs directly at http://localhost:8001/docs etc."
}

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "   SecuRock SOC Started Successfully!     " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Dashboard: http://localhost:5173 (if Node ran)"
Write-Host "Auth API:  http://localhost:8001/docs"
Write-Host "`nBackend services are running in minimized windows."
Write-Host "Close those windows to stop the platform."
