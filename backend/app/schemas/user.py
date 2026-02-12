
from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "viewer"

class UserCreate(UserBase):
    organization_id: UUID
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: UUID
    organization_id: UUID
    is_active: bool
    email_verified: bool
    last_login: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
