import pytest
import httpx
import uuid
from app.main import app
from app.utils.jwt import create_access_token
from app.models.organization import Organization
from app.models.user import User

@pytest.mark.asyncio
async def test_get_my_organization_unauthorized():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/organizations/me")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_my_organization_authorized_admin(db_session):
    # Insert test organization
    org_id = uuid.uuid4()
    org = Organization(
        id=org_id,
        name="SecuRock Admin Org",
        slug="securock-admin-org-" + str(uuid.uuid4())[:8],
        plan="trial",
        plan_tier="trial"
    )
    db_session.add(org)
    
    # Insert associated admin user
    user_id = uuid.uuid4()
    user = User(
        id=user_id,
        email="sreeram_rbac@securock.ai",
        password_hash="mockhashedpassword",
        full_name="Sreeram M R",
        role="admin",
        organization_id=org_id,
        is_active=True
    )
    db_session.add(user)
    await db_session.commit()

    # Generate admin token
    subject = {"user_id": str(user_id), "organization_id": str(org_id), "role": "admin"}
    token = create_access_token(subject)
    
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get(
            "/api/organizations/me",
            headers={"Authorization": f"Bearer {token}"}
        )
    assert response.status_code == 200
    assert response.json()["name"] == "SecuRock Admin Org"
