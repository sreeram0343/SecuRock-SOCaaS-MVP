
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.api.deps import get_current_user
from app.models.incident import Incident
from app.models.user import User
from app.schemas.incident import IncidentCreate, IncidentResponse

router = APIRouter()

@router.post("/", response_model=IncidentResponse)
async def create_incident(
    incident_in: IncidentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    incident = Incident(
        organization_id=current_user.organization_id,
        created_by=current_user.id,
        **incident_in.model_dump(exclude={"alert_ids"})
    )
    db.add(incident)
    await db.commit()
    await db.refresh(incident)
    return incident

@router.get("/", response_model=list[IncidentResponse])
async def get_incidents(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Incident).where(Incident.organization_id == current_user.organization_id))
    return result.scalars().all()
