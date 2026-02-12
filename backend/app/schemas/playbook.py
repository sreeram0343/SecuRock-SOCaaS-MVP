
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, Dict, Any, List

class PlaybookBase(BaseModel):
    name: str
    description: Optional[str] = None
    trigger_conditions: Dict[str, Any]
    actions: List[Dict[str, Any]]
    is_enabled: bool = True

class PlaybookCreate(PlaybookBase):
    pass

class PlaybookUpdate(BaseModel):
    name: Optional[str] = None
    trigger_conditions: Optional[Dict[str, Any]] = None
    actions: Optional[List[Dict[str, Any]]] = None
    is_enabled: Optional[bool] = None

class PlaybookResponse(PlaybookBase):
    id: UUID
    organization_id: UUID
    execution_count: int
    created_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PlaybookExecutionResponse(BaseModel):
    id: UUID
    playbook_id: UUID
    alert_id: Optional[UUID] = None
    status: str
    result: Dict[str, Any]
    error_message: Optional[str] = None
    executed_at: datetime

    model_config = ConfigDict(from_attributes=True)
