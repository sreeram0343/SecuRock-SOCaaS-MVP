from fastapi import Depends, HTTPException, status
from typing import List
from app.models.user import User
from app.api.deps import get_current_active_user

class RoleChecker:
    """
    Dependency class to enforce Role-Based Access Control (RBAC).
    Usage in routes:
    @router.get("/admin", dependencies=[Depends(RoleChecker(["admin"]))])
    """
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_active_user)) -> User:
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted for this role."
            )
        return user
