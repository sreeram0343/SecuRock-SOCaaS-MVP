
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
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

@router.post("/{incident_id}/investigate", response_model=IncidentResponse)
async def trigger_incident_investigation(
    incident_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # 1. Fetch the incident
    result = await db.execute(
        select(Incident).where(
            Incident.id == incident_id,
            Incident.organization_id == current_user.organization_id
        )
    )
    incident = result.scalars().first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    # 2. Get associated alert data if present
    alert_data = {
        "title": incident.title,
        "description": incident.description or "No description",
        "severity": incident.severity,
        "source_ip": "192.168.1.100"  # Default fallback if no alert found
    }

    # Fetch associated alerts
    from app.models.incident import IncidentAlert
    from app.models.alert import Alert
    
    associations_result = await db.execute(
        select(IncidentAlert).where(IncidentAlert.incident_id == incident.id)
    )
    associations = associations_result.scalars().all()
    if associations:
        # Get the first associated alert details
        first_alert_id = associations[0].alert_id
        alert_result = await db.execute(
            select(Alert).where(Alert.id == first_alert_id)
        )
        associated_alert = alert_result.scalars().first()
        if associated_alert:
            alert_data = {
                "title": associated_alert.title,
                "description": associated_alert.description or "No description",
                "severity": associated_alert.severity,
                "source_ip": associated_alert.source_ip or "192.168.1.100"
            }

    # 3. Run the multi-agent investigation workflow
    from app.agents.investigation_graph import run_investigation
    try:
        investigation_result = await run_investigation(
            str(incident.id),
            str(incident.organization_id),
            alert_data
        )
        
        # 4. Save results to the database
        incident.status = "investigating"
        incident.risk_score = float(investigation_result.get("risk_score", 0.0))
        incident.patient_zero = investigation_result.get("patient_zero", "Unknown")
        incident.blast_radius = investigation_result.get("blast_radius", {})
        incident.timeline = investigation_result.get("timeline", [])
        incident.ai_summary = investigation_result.get("case_summary", "")
        incident.remediation_steps = investigation_result.get("remediation_steps", [])
        
        await db.commit()
        await db.refresh(incident)
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"AI Investigation failed: {str(e)}")

    return incident
