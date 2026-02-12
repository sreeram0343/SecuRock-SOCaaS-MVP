from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    organization_name: str

class Telemetry(BaseModel):
    cpu: float
    process: str
    file_activity: int = 0
    timestamp: str 
    # Additional for Agent V2
    memory: float = 0.0
    network_traffic: float = 0.0

class AlertBase(BaseModel):
    severity: str
    attack_type: str
    details: str
    action_taken: str

class AlertOut(AlertBase):
    id: int
    timestamp: datetime
    model_config = {"from_attributes": True}

class AgentHeartbeat(BaseModel):
    hostname: str
    ip_address: str
    status: str
