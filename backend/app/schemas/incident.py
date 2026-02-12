
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, List

class IncidentBase(BaseModel):
    title: str
    description: Optional[str] = None
    severity: str
    priority: str = "medium"

class IncidentCreate(IncidentBase):
    alert_ids: Optional[List[UUID]] = []

class IncidentUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[UUID] = None
    resolution_notes: Optional[str] = None

class IncidentResponse(IncidentBase):
    id: UUID
    organization_id: UUID
    status: str
    assigned_to: Optional[UUID] = None
    created_by: UUID
    created_at: datetime
    resolved_at: Optional[datetime] = None
    resolution_notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
