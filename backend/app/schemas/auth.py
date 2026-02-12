from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from uuid import UUID
import re

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[UUID] = None
    organization_id: Optional[UUID] = None
    role: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @field_validator('email')
    def normalize_email(cls, v):
        return v.lower()

class UserSignup(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str
    organization_name: str
    plan_tier: Optional[str] = "trial"

    @field_validator('email')
    def normalize_email(cls, v):
        return v.lower()

    @field_validator('password')
    def validate_password_strength(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(min_length=8)

class RefreshToken(BaseModel):
    refresh_token: str
