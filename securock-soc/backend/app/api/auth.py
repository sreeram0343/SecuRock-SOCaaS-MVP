from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.config import settings
from app.core.security import create_access_token, verify_password, get_password_hash
from app.schemas.user import Token
import os

router = APIRouter()

# For MVP, we use env vars for the single admin user
ADMIN_USER = os.getenv("ADMIN_USER", "admin")
# Use a default hash for 'admin123' to avoid rehashing on every load if not needed, 
# but for simplicity we hash it at startup
ADMIN_PASS_HASH = get_password_hash(os.getenv("ADMIN_PASS", "admin123"))

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != ADMIN_USER or not verify_password(form_data.password, ADMIN_PASS_HASH):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=form_data.username, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
