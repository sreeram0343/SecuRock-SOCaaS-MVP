
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.api.deps import get_current_user, User
from app.models.organization import Organization
from app.schemas.organization import OrganizationResponse
from sqlalchemy.future import select

router = APIRouter()

@router.get("/me", response_model=OrganizationResponse)
async def get_my_organization(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Organization).where(Organization.id == current_user.organization_id))
    org = result.scalars().first()
    return org
