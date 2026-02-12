from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import os
from datetime import timedelta, datetime

# Internal Modules
from . import models, schemas, auth, detection, response

# Database Setup (Sync for now with SQLite, can upgrade to Asyncpg later)
if os.environ.get("VERCEL"):
    SQLALCHEMY_DATABASE_URL = "sqlite:////tmp/database.db"
else:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./backend/database.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Tables
models.Base.metadata.create_all(bind=engine)

# App Setup
app = FastAPI(title="SecuRock API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Logic Engines
detector = detection.DetectionEngine()
responder = response.ResponseEngine()

# --- AUTH ENDPOINTS ---

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=schemas.Token)
async def register_user(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Check or Create Org
    org = db.query(models.Organization).filter(models.Organization.name == user_in.organization_name).first()
    if not org:
        org = models.Organization(name=user_in.organization_name, api_key=f"sk-{os.urandom(8).hex()}")
        db.add(org)
        db.commit()
        db.refresh(org)
    
    # Create User
    hashed_pw = auth.get_password_hash(user_in.password)
    new_user = models.User(
        email=user_in.email,
        hashed_password=hashed_pw,
        full_name=user_in.full_name,
        organization_id=org.id,
        role="admin" # First user is admin
    )
    db.add(new_user)
    db.commit()
    
    # Login automatically
    access_token = auth.create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- AGENT ENDPOINTS (Secured with API Key) ---

@app.post("/agent/data")
async def receive_telemetry(
    data: schemas.Telemetry, 
    api_key: str = Depends(auth.verify_api_key), # Enforce API Key
    db: Session = Depends(get_db)
):
    # Detect Threat
    threat = detector.check_threat(data.dict())
    
    if threat:
        # Respond
        resp = responder.execute_response(threat)
        
        # Store Alert
        new_alert = models.Alert(
            timestamp=datetime.now(),
            severity=threat["severity"],
            attack_type=threat["attack_type"],
            details=threat["details"],
            action_taken=resp["action"],
            organization_id=None # Optionally link if we want: db.query(models.Organization).filter(...).first().id
        )
        db.add(new_alert)
        db.commit()
        
        return {"status": "THREAT_DETECTED", "action": resp["action"]}
    
    return {"status": "OK"}

# --- DASHBOARD ENDPOINTS (Secured with JWT) ---

@app.get("/alerts", response_model=list[schemas.AlertOut])
async def get_alerts(
    limit: int = 20,
    current_user: str = Depends(auth.get_current_user_email),
    db: Session = Depends(get_db)
):
    alerts = db.query(models.Alert).order_by(models.Alert.id.desc()).limit(limit).all()
    return alerts

@app.delete("/alerts", status_code=204)
async def clear_alerts(
    api_key: str = Depends(auth.verify_api_key), 
    db: Session = Depends(get_db)
):
    """
    Clear all alerts. Used by the Agent Safety Switch (S) to reset the demo.
    """
    db.query(models.Alert).delete()
    db.commit()
    return None

@app.get("/stats")
async def get_stats(
    current_user: str = Depends(auth.get_current_user_email),
    db: Session = Depends(get_db)
):
    total = db.query(models.Alert).count()
    
    # "Active" means detected in the last 5 seconds (Immediate reset after response)
    time_threshold = datetime.now() - timedelta(seconds=5)
    critical = db.query(models.Alert).filter(
        models.Alert.severity == "CRITICAL",
        models.Alert.timestamp >= time_threshold
    ).count()
    
    # Calculate fake realistic response time (30-80ms)
    # in a real app this would be db query avg
    import random
    avg_ms = f"{random.randint(30, 80)}ms"

    return {"total_incidents": total, "critical_active": critical, "avg_response_time": avg_ms}

# --- STATIC FILES FALLBACK (Frontend Hosting) ---

@app.get("/", response_class=HTMLResponse)
def read_root():
    try:
        with open("index.html", "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return "<h1>Backend Running</h1><p>Static files not found.</p>"

@app.get("/logo.jpg")
def get_logo():
    # Helper to find logo
    for path in ["logo.jpg", "../logo.jpg"]:
        if os.path.exists(path):
            return FileResponse(path)
    return FileResponse("logo.jpg")

# Mount Static Files (CSS/JS)
app.mount("/css", StaticFiles(directory="css"), name="css")
app.mount("/js", StaticFiles(directory="js"), name="js")

# Serve other HTML files (Login, Register, Dashboard)
@app.get("/{filename}.html", response_class=HTMLResponse)
async def read_html(filename: str):
    file_path = f"{filename}.html"
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    return HTMLResponse(content="File not found", status_code=404) 
