
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, Dict, Any

class OrganizationBase(BaseModel):
    name: str
    slug: str

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class OrganizationResponse(OrganizationBase):
    id: UUID
    plan: str
    trial_end_date: Optional[datetime] = None
    is_active: bool
    settings: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
