
from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.api_key import ApiKey
from app.models.alert import Alert
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import Dict, Any
from app.services.ml_service import ml_service
import datetime
import hashlib

router = APIRouter()

class IngestEvent(BaseModel):
    timestamp: str
    source_ip: str
    destination_ip: str
    event_type: str
    user: str
    metadata: Dict[str, Any]

async def process_event(event: IngestEvent, organization_id: str, db: AsyncSession):
    # ML Detection Logic
    confidence = ml_service.predict_anomaly([]) # Pass features
    
    is_anomaly = confidence > 0.8 # Threshold
    
    if is_anomaly:
        alert = Alert(
            organization_id=organization_id,
            severity="high", # Determine based on logic
            title=f"Anomaly Detected: {event.event_type}",
            description=f"Unusual activity detected from {event.source_ip}",
            source_ip=event.source_ip,
            destination_ip=event.destination_ip,
            event_type=event.event_type,
            confidence_score=confidence,
            raw_data=event.model_dump()
        )
        db.add(alert)
        await db.commit()

@router.post("/ingest")
async def ingest_event(event: IngestEvent, request: Request, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    api_key_header = request.headers.get("X-API-Key")
    if not api_key_header:
        raise HTTPException(status_code=401, detail="Missing API Key")

    # Validate API Key
    hashed_key = hashlib.sha256(api_key_header.encode()).hexdigest()
    
    result = await db.execute(select(ApiKey).where(ApiKey.key_hash == hashed_key))
    api_key_record = result.scalars().first()
    
    if not api_key_record:
        raise HTTPException(status_code=401, detail="Invalid API Key")
        
    if not api_key_record.is_active:
        raise HTTPException(status_code=403, detail="API Key is inactive")
        
    if api_key_record.expires_at and api_key_record.expires_at < datetime.datetime.utcnow():
        raise HTTPException(status_code=403, detail="API Key has expired")

    # Update usage stats (optional, might want to be async/background to not block ingestion)
    # api_key_record.last_used_at = datetime.datetime.utcnow()
    # await db.commit() 
    
    organization_id = api_key_record.organization_id
    
    # background_tasks.add_task(process_event, event, organization_id, db)
    # Push to Redis for async processing
    from app.services.redis_service import redis_service
    await redis_service.push_log("logs_queue", event.model_dump())
    
    return {"status": "processing"}
