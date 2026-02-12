
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.api.deps import get_current_user
from app.services.subscription_service import (
    get_plan_features,
    check_trial_status,
    upgrade_plan,
    check_feature_access
)
from app.config import settings
from pydantic import BaseModel
from typing import Dict

router = APIRouter()

class PlanUpgradeRequest(BaseModel):
    plan_tier: str  # basic or premium

class PlanResponse(BaseModel):
    name: str
    tier: str
    features: Dict
    price: str

@router.get("/plans")
async def get_available_plans():
    """Get all available subscription plans"""
    plans = []
    
    for tier, features in settings.PLAN_FEATURES.items():
        if tier == "trial":
            continue
            
        price = "$0/month" if tier == "basic" else "$99/month" if tier == "premium" else "$0"
        
        plans.append({
            "name": tier.capitalize(),
            "tier": tier,
            "features": features,
            "price": price,
            "recommended": tier == "premium"
        })
    
    return {"plans": plans}

@router.get("/current")
async def get_current_subscription(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current subscription details"""
    org_id = current_user.get("organization_id")
    
    from sqlalchemy.future import select
    from app.models.organization import Organization
    
    result = await db.execute(
        select(Organization).where(Organization.id == org_id)
    )
    org = result.scalars().first()
    
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    trial_status = await check_trial_status(org_id, db)
    plan_features = await get_plan_features(org.plan_tier)
    
    return {
        "plan_tier": org.plan_tier,
        "plan_name": org.plan_tier.capitalize(),
        "features": plan_features,
        "trial_status": trial_status,
        "is_active": org.is_active
    }

@router.post("/upgrade")
async def upgrade_subscription(
    request: PlanUpgradeRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upgrade to a higher plan"""
    org_id = current_user.get("organization_id")
    
    # Validate plan tier
    if request.plan_tier not in ["basic", "premium"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid plan tier. Must be 'basic' or 'premium'"
        )
    
    # Perform upgrade
    success = await upgrade_plan(org_id, request.plan_tier, db)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upgrade plan"
        )
    
    return {
        "message": f"Successfully upgraded to {request.plan_tier} plan",
        "plan_tier": request.plan_tier
    }

@router.get("/trial-status")
async def get_trial_status(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get trial status for current organization"""
    org_id = current_user.get("organization_id")
    trial_status = await check_trial_status(org_id, db)
    
    return trial_status
