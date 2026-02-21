from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.services.narrative_llm import narrative_llm
from app.schemas.incident import IncidentNarrativeRequest, IncidentNarrativeResponse

router = APIRouter()

@router.post("/narrative", response_model=IncidentNarrativeResponse)
async def generate_incident_narrative(
    request: IncidentNarrativeRequest, 
    current_user: str = Depends(get_current_user)
):
    """Generate AI narrative for an incident"""
    result = narrative_llm.generate_narrative(
        host=request.host,
        incidents=request.incidents,
        risk_score=request.risk_score,
        severity=request.severity
    )
    return result
