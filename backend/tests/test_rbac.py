import pytest
from fastapi import Request
from unittest.mock import MagicMock
from app.middleware.rbac import rbac, PermissionChecker
from app.utils.jwt import create_access_token
from fastapi.exceptions import HTTPException

def test_rbac_x_role_header_fallback():
    # Test fallback to X-Role header
    request = MagicMock(spec=Request)
    request.headers = {"X-Role": "admin"}
    
    # Run check for admin permission
    res = pytest.run_async(rbac.verify_role(request, ["admin:system"]))
    assert res["role"] == "admin"
    assert "admin:system" in res["permissions"]

def test_rbac_x_role_header_insufficient_permissions():
    request = MagicMock(spec=Request)
    request.headers = {"X-Role": "analyst"}
    
    # Analyst shouldn't have admin:system
    with pytest.raises(HTTPException) as exc:
        pytest.run_async(rbac.verify_role(request, ["admin:system"]))
    assert exc.value.status_code == 403

def test_rbac_jwt_token_valid():
    request = MagicMock(spec=Request)
    
    # Create valid admin token
    subject = {"user_id": "test-user-id", "organization_id": "test-org-id", "role": "admin"}
    token = create_access_token(subject)
    
    request.headers = {"Authorization": f"Bearer {token}"}
    
    res = pytest.run_async(rbac.verify_role(request, ["admin:system"]))
    assert res["role"] == "admin"
    assert res["user_id"] == "test-user-id"
    assert res["organization_id"] == "test-org-id"

def test_rbac_jwt_token_invalid_signature():
    request = MagicMock(spec=Request)
    request.headers = {"Authorization": "Bearer invalidtoken.invalidpayload.invalidsignature"}
    
    with pytest.raises(HTTPException) as exc:
        pytest.run_async(rbac.verify_role(request, ["read:dashboard"]))
    assert exc.value.status_code == 401

@pytest.fixture(autouse=True)
def run_async_helper(event_loop):
    # Helper to execute async functions synchronously inside normal tests
    def run(coro):
        return event_loop.run_until_complete(coro)
    pytest.run_async = run
