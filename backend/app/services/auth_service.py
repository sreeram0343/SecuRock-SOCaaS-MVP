
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.models.organization import Organization
from app.schemas.auth import UserSignup, Token
from app.utils.password import get_password_hash, verify_password
from app.utils.jwt import create_access_token, create_refresh_token
from datetime import datetime, timedelta
import uuid

async def authenticate_user(db: AsyncSession, email: str, password: str):
    email = email.lower()
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user

async def register_user_org(db: AsyncSession, signup_data: UserSignup):
    # Normalize email
    signup_data.email = signup_data.email.lower()
    
    # Check if user exists
    result = await db.execute(select(User).where(User.email == signup_data.email))
    if result.scalars().first():
        return None  # User already exists

    # Validate plan tier
    from app.config import settings
    plan_tier = getattr(signup_data, 'plan_tier', 'trial')
    if plan_tier not in ['trial', 'basic', 'premium']:
        plan_tier = 'trial'
    
    # Get plan features
    plan_features = settings.PLAN_FEATURES.get(plan_tier, settings.PLAN_FEATURES['trial'])

    # Create Org
    org = Organization(
        name=signup_data.organization_name,
        slug=signup_data.organization_name.lower().replace(" ", "-") + "-" + str(uuid.uuid4())[:4],
        plan=plan_tier,
        plan_tier=plan_tier,
        trial_end_date=datetime.utcnow() + timedelta(days=settings.TRIAL_PERIOD_DAYS) if plan_tier == 'trial' else None,
        max_users=str(plan_features['max_users']),
        max_alerts_per_month=str(plan_features['max_alerts_per_month']),
        features=plan_features
    )
    db.add(org)
    await db.flush() # Get ID

    # Create User
    user = User(
        organization_id=org.id,
        email=signup_data.email,
        password_hash=get_password_hash(signup_data.password),
        full_name=signup_data.full_name,
        role="owner",
        is_active=True,
        email_verified=False
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

