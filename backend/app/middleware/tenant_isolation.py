
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.utils.jwt import decode_token
from jose import JWTError

# Note: In FastAPI/Starlette, middleware is a class or simple function.
# We'll use a functional approach or class-based. The prompt used a decorator style which is valid in main.py but for a module a class is often cleaner or just the function logic.
# However, to match the prompt's structure `tenant_isolation.py`, we will define a Starlette middleware class or function.

async def tenant_context_middleware(request: Request, call_next):
    # Skip for public routes
    public_routes = ["/", "/docs", "/redoc", "/openapi.json", "/api/auth/login", "/api/auth/signup", "/api/ingest", "/api/auth/refresh"]
    if any(request.url.path.startswith(route) for route in public_routes):
        return await call_next(request)
    
    # Extract JWT from Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        # If no token, we might let it pass to the route handler which enforces auth, 
        # BUT the prompt says "All DB queries must filter by organization_id", imply strict middleware.
        # But `Depends(get_current_user)` already handles 401. 
        # Middleware is good for injecting state.
        # Let's return 401 here to be safe as per prompt logic.
        return JSONResponse(status_code=401, content={"detail": "Unauthorized: Missing token"})
    
    token = auth_header.split(" ")[1]
    try:
        payload = decode_token(token)
        request.state.organization_id = payload.get("organization_id")
        request.state.user_id = payload.get("user_id")
        request.state.user_role = payload.get("role")
    except JWTError:
        return JSONResponse(status_code=401, content={"detail": "Invalid token"})
    
    response = await call_next(request)
    return response
