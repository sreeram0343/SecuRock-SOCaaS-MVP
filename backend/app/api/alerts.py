
from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from app.services.websocket_manager import manager
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app.api.deps import get_current_user
from app.models.alert import Alert
from app.models.user import User
from app.schemas.alert import AlertResponse, AlertListResponse

router = APIRouter()

@router.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep alive / receive messages (client might send pings)
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@router.get("/", response_model=AlertListResponse)
async def get_alerts(
    skip: int = 0,
    limit: int = 20,
    severity: str = Query(None),
    status: str = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Alert).where(Alert.organization_id == current_user.organization_id)
    
    if severity:
        query = query.where(Alert.severity == severity)
    if status:
        query = query.where(Alert.status == status)
        
    query = query.offset(skip).limit(limit).order_by(Alert.created_at.desc())
    
    result = await db.execute(query)
    alerts = result.scalars().all()
    
    # Total count (simplified, ideally separate count query)
    total = len(alerts) 
    
    return {"items": alerts, "total": total, "page": skip // limit + 1, "size": limit}
