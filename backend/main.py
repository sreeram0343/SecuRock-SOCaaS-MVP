from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from . import detection
from . import response

# Database Setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./backend/database.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String)
    severity = Column(String)
    attack_type = Column(String)
    details = Column(String)
    action_taken = Column(String)

Base.metadata.create_all(bind=engine)

# App Setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global System Status
system_status = "SAFE"
latest_response_log = "System monitor active."

# Logic Engines
detector = detection.DetectionEngine()
responder = response.ResponseEngine()

# Models
class Telemetry(BaseModel):
    cpu: float
    process: str
    file_activity: int = 0
    timestamp: str

@app.post("/agent/data")
def receive_telemetry(data: Telemetry):
    global system_status, latest_response_log
    
    # 1. Detect
    threat = detector.check_threat(data.dict())
    
    if threat:
        # 2. Respond
        resp = responder.execute_response(threat)
        system_status = resp["status"]
        latest_response_log = resp["log"]
        
        # 3. Store Alert
        db = SessionLocal()
        new_alert = Alert(
            timestamp=threat["timestamp"],
            severity=threat["severity"],
            attack_type=threat["attack_type"],
            details=threat["details"],
            action_taken=resp["action"]
        )
        db.add(new_alert)
        db.commit()
        db.close()
        
        return {"status": "THREAT_DETECTED", "action": resp["action"]}
    
    # No threat, reset status if it was high? 
    # For demo persistence, maybe we keep it isolated until reset?
    # Let's auto-recover for simplicity if CPU drops, or just keep it based on last packet?
    # Auto-Recovery Logic
    # Check if all metrics are normal to reset status to SAFE
    is_cpu_normal = data.cpu < 80
    is_file_normal = data.file_activity < 10
    is_proc_normal = "evil_process" not in data.process and "trojan" not in data.process
    
    if system_status != "SAFE" and is_cpu_normal and is_file_normal and is_proc_normal:
         system_status = "SAFE"
         latest_response_log = "Threats mitigated. System SAFE."

    return {"status": "OK"}

@app.get("/alerts")
def get_alerts():
    db = SessionLocal()
    alerts = db.query(Alert).order_by(Alert.id.desc()).limit(10).all()
    db.close()
    return alerts

@app.get("/status")
def get_status():
    return {
        "status": system_status,
        "log": latest_response_log
    }

@app.get("/report")
def generate_report():
    db = SessionLocal()
    alerts = db.query(Alert).order_by(Alert.id.desc()).limit(5).all()
    db.close()
    
    report = "SECUREOCK INCIDENT RESPONSE REPORT\n"
    report += "====================================\n"
    report += f"Generated: {datetime.now().isoformat()}\n\n"
    
    if not alerts:
        report += "No recent incidents detected.\n"
    else:
        for alert in alerts:
            report += f"ID: {alert.id} | TIME: {alert.timestamp}\n"
            report += f"SEVERITY: {alert.severity}\n"
            report += f"THREAT: {alert.attack_type}\n"
            report += f"DETAILS: {alert.details}\n"
            report += f"RESPONSE: {alert.action_taken}\n"
            report += "------------------------------------\n"
            
    return {"raw_text": report}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
