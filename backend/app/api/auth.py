
from fastapi import APIRouter, Depends, HTTPException, status, Response, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_db
from app.api.deps import get_current_user
from app.services.auth_service import authenticate_user, register_user_org
from app.schemas.auth import UserSignup, Token, UserLogin, RefreshToken
from app.utils.jwt import create_access_token, create_refresh_token, decode_token
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/signup", response_model=Token)
async def signup(user_data: UserSignup, db: AsyncSession = Depends(get_db)):
    try:
        user = await register_user_org(db, user_data)
        if not user:
             # Standardization: Don't leak if email exists or not, but for signup it's tricky.
             # Ideally we say "If email exists, please login".
             # But here we return 400 as per request.
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": "REGISTRATION_FAILED", "message": "Email already registered"},
            )
        
        access_token = create_access_token(
            subject={"user_id": str(user.id), "organization_id": str(user.organization_id), "role": user.role}
        )
        refresh_token = create_refresh_token(subject=str(user.id))
        
        return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "SERVER_ERROR", "message": "Internal server error during registration"}
        )

@router.post("/login", response_model=Token)
async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    logger.info(f"Login attempt for user: {form_data.username}")
    # normalize email here too just in case
    user = await authenticate_user(db, form_data.username.lower(), form_data.password)
    
    if not user:
        # Standardized error response
        logger.warning(f"Login failed for {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "AUTH_FAILED", "message": "Invalid credentials"},
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Active check
    if not user.is_active:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "ACCOUNT_DISABLED", "message": "Your account is inactive."},
        )

    access_token = create_access_token(
        subject={"user_id": str(user.id), "organization_id": str(user.organization_id), "role": user.role}
    )
    refresh_token = create_refresh_token(subject=str(user.id))

    # Set refresh token in httpOnly cookie with SameSite=Lax
    response.set_cookie(
        key="refresh_token", 
        value=refresh_token, 
        httponly=True, 
        secure=True, # Should be True in production (HTTPS)
        samesite="lax",
        max_age=7 * 24 * 60 * 60 # 7 days
    )
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/refresh", response_model=Token)
async def refresh_token(token_data: RefreshToken, db: AsyncSession = Depends(get_db)):
    try:
        payload = decode_token(token_data.refresh_token)
        if payload.get("type") != "refresh":
             raise HTTPException(status_code=401, detail={"error": "INVALID_TOKEN", "message": "Invalid token type"})
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail={"error": "INVALID_TOKEN", "message": "Invalid token payload"})

        # Fetch user
        from sqlalchemy.future import select
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        
        if not user or not user.is_active:
             raise HTTPException(status_code=401, detail={"error": "AUTH_FAILED", "message": "User inactive or not found"})

        new_access_token = create_access_token(
            subject={"user_id": str(user.id), "organization_id": str(user.organization_id), "role": user.role}
        )
        
        return {"access_token": new_access_token, "refresh_token": token_data.refresh_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Refresh token error: {e}")
        raise HTTPException(status_code=401, detail={"error": "INVALID_TOKEN", "message": "Invalid or expired refresh token"})
