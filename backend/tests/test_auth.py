import pytest
import httpx
import uuid
from app.main import app
from app.models.user import User
from sqlalchemy.future import select

@pytest.mark.asyncio
async def test_signup_endpoint_validation(db_session):
    # Test signup logic with valid mock request fields
    payload = {
        "email": "developer_test@securock.ai",
        "password": "Strongpassword123!",
        "full_name": "Developer Securock",
        "organization_name": "DevSecOps Ltd",
        "plan_tier": "trial"
    }
    
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/auth/signup", json=payload)
        
    assert response.status_code == 200
    res_data = response.json()
    assert "access_token" in res_data
    assert "refresh_token" in res_data
    
    # Assert DB state is updated
    result = await db_session.execute(select(User).where(User.email == "developer_test@securock.ai"))
    user = result.scalars().first()
    assert user is not None
    assert user.full_name == "Developer Securock"
    assert user.role == "owner"
