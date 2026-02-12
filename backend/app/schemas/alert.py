
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, Dict, Any, List

class AlertBase(BaseModel):
    severity: str
    title: str
    description: Optional[str] = None
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    event_type: Optional[str] = None
    mitre_tactic: Optional[str] = None
    mitre_technique: Optional[str] = None
    raw_data: Optional[Dict[str, Any]] = None

class AlertCreate(AlertBase):
    pass

class AlertUpdate(BaseModel):
    status: Optional[str] = None
    severity: Optional[str] = None
    acknowledged_by: Optional[UUID] = None

class AlertResponse(AlertBase):
    id: UUID
    organization_id: UUID
    confidence_score: float
    status: str
    created_at: datetime
    acknowledged_by: Optional[UUID] = None
    acknowledged_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class AlertListResponse(BaseModel):
    items: List[AlertResponse]
    total: int
    page: int
    size: int
