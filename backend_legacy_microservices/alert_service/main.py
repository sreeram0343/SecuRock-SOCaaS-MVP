from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
from . import models, database
from .database import engine, get_db
from shared.schemas import AlertCreate, Alert, Severity

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SecuRock Alert Service")

# --- WebSocket Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# --- Endpoints ---

@app.post("/alerts", response_model=Alert)
async def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    db_alert = models.Alert(**alert.model_dump()) 
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    
    # Notify Frontend
    await manager.broadcast(db_alert.title) # Sending simple message for now, ideally full JSON
    
    return db_alert

@app.get("/alerts", response_model=List[Alert])
def read_alerts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    alerts = db.query(models.Alert).offset(skip).limit(limit).all()
    return alerts

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
