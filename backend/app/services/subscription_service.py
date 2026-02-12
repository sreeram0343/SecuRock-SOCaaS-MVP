
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.organization import Organization
from app.models.subscription import Subscription
from app.config import settings
from datetime import datetime, timedelta
from typing import Optional, Dict

async def get_plan_features(plan_tier: str) -> Dict:
    """Get features for a specific plan tier"""
    return settings.PLAN_FEATURES.get(plan_tier, settings.PLAN_FEATURES["trial"])

async def check_feature_access(organization_id: str, feature: str, db: AsyncSession) -> bool:
    """Check if organization has access to a specific feature"""
    result = await db.execute(
        select(Organization).where(Organization.id == organization_id)
    )
    org = result.scalars().first()
    
    if not org:
        return False
    
    plan_features = await get_plan_features(org.plan_tier)
    return plan_features.get(feature, False)

async def check_usage_limit(organization_id: str, limit_type: str, db: AsyncSession) -> tuple[bool, int]:
    """
    Check if organization is within usage limits
    Returns (is_within_limit, current_limit)
    """
    result = await db.execute(
        select(Organization).where(Organization.id == organization_id)
    )
    org = result.scalars().first()
    
    if not org:
        return False, 0
    
    plan_features = await get_plan_features(org.plan_tier)
    limit = plan_features.get(limit_type, 0)
    
    # -1 means unlimited
    if limit == -1:
        return True, -1
    
    return True, limit

async def upgrade_plan(organization_id: str, new_plan: str, db: AsyncSession) -> bool:
    """Upgrade organization plan"""
    result = await db.execute(
        select(Organization).where(Organization.id == organization_id)
    )
    org = result.scalars().first()
    
    if not org:
        return False
    
    # Update organization plan
    org.plan_tier = new_plan
    org.plan = new_plan
    
    # Update limits based on new plan
    plan_features = await get_plan_features(new_plan)
    org.max_users = str(plan_features["max_users"])
    org.max_alerts_per_month = str(plan_features["max_alerts_per_month"])
    org.features = plan_features
    
    # Create subscription record
    subscription = Subscription(
        organization_id=organization_id,
        plan_tier=new_plan,
        status="active",
        started_at=datetime.utcnow()
    )
    db.add(subscription)
    
    await db.commit()
    await db.refresh(org)
    
    return True

async def check_trial_status(organization_id: str, db: AsyncSession) -> Dict:
    """Check if trial is still active"""
    result = await db.execute(
        select(Organization).where(Organization.id == organization_id)
    )
    org = result.scalars().first()
    
    if not org:
        return {"is_trial": False, "is_expired": True, "days_remaining": 0}
    
    if org.plan_tier != "trial":
        return {"is_trial": False, "is_expired": False, "days_remaining": 0}
    
    if not org.trial_end_date:
        return {"is_trial": True, "is_expired": True, "days_remaining": 0}
    
    now = datetime.utcnow()
    is_expired = now > org.trial_end_date
    days_remaining = max(0, (org.trial_end_date - now).days)
    
    return {
        "is_trial": True,
        "is_expired": is_expired,
        "days_remaining": days_remaining,
        "trial_end_date": org.trial_end_date
    }

async def initialize_plan(organization_id: str, plan_tier: str, db: AsyncSession):
    """Initialize organization with plan features"""
    result = await db.execute(
        select(Organization).where(Organization.id == organization_id)
    )
    org = result.scalars().first()
    
    if not org:
        return
    
    plan_features = await get_plan_features(plan_tier)
    org.plan_tier = plan_tier
    org.plan = plan_tier
    org.max_users = str(plan_features["max_users"])
    org.max_alerts_per_month = str(plan_features["max_alerts_per_month"])
    org.features = plan_features
    
    # Set trial end date if trial plan
    if plan_tier == "trial":
        org.trial_end_date = datetime.utcnow() + timedelta(days=settings.TRIAL_PERIOD_DAYS)
    
    await db.commit()
