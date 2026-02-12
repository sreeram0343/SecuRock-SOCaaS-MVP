from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class Severity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class LogEntry(BaseModel):
    timestamp: datetime
    source_ip: str
    host: str
    event_type: str
    message: str
    details: Optional[Dict[str, Any]] = None

class AlertBase(BaseModel):
    title: str
    description: str
    severity: Severity
    source_ip: str
    status: str = "OPEN"
    timestamp: datetime = datetime.now()

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None
    role: str = "analyst"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True
