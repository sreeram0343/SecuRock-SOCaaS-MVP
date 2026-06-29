
from fastapi import Request, HTTPException, status
from typing import Optional, List
from jose import jwt
from app.config import settings

class RBACMiddleware:
    """
    Role-Based Access Control Middleware.
    Decodes the Bearer JWT token to verify user role and validates
    that the role contains all required permissions.
    """
    def __init__(self):
        # Roles and permissions mapping
        self.roles = {
            "admin": ["read:logs", "write:logs", "read:dashboard", "admin:system"],
            "analyst": ["read:logs", "read:dashboard"],
            "viewer": ["read:dashboard"]
        }

    async def verify_role(self, request: Request, required_permissions: List[str] = []) -> dict:
        # 1. Extract and decode Bearer token
        auth_header = request.headers.get("Authorization")
        role = "analyst"  # Default fallback if no auth provided (backward compatibility)
        user_id = None
        organization_id = None
        
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
                role = payload.get("role", "analyst")
                user_id = payload.get("user_id")
                organization_id = payload.get("organization_id")
            except Exception:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired access token"
                )
        else:
            # Fallback to X-Role header for dev simplicity / testing
            role = request.headers.get("X-Role", "analyst")
        
        # 2. Validate Role
        if role not in self.roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{role}' is invalid"
            )
            
        # 3. Check Permissions
        user_perms = self.roles[role]
        for perm in required_permissions:
            if perm not in user_perms:
                 raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Missing permission: {perm}"
                )
        
        return {
            "user_id": user_id,
            "organization_id": organization_id,
            "role": role,
            "permissions": user_perms
        }

class PermissionChecker:
    """
    FastAPI dependency helper for checking endpoint permissions.
    """
    def __init__(self, required_permissions: List[str]):
        self.required_permissions = required_permissions

    async def __call__(self, request: Request) -> dict:
        return await rbac.verify_role(request, self.required_permissions)

rbac = RBACMiddleware()
