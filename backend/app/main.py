
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, organizations, alerts, ingest, incidents, analytics, subscriptions
# import other routers...
# import middleware
from app.middleware.tenant_isolation import tenant_context_middleware
from app.middleware.rbac import rbac # RBAC Placeholder

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Custom Middleware
# app.middleware("http")(tenant_context_middleware) 
# Note: Using decorator syntax on the function imported

@app.middleware("http")
async def add_tenant_context(request, call_next):
    return await tenant_context_middleware(request, call_next)

# Background Task for Redis Subscriber
from app.services.redis_service import redis_service
from app.services.websocket_manager import manager
import asyncio
import json

async def redis_listener():
    try:
        await redis_service.connect()
        pubsub = redis_service.redis.pubsub()
        await pubsub.subscribe("alerts")
        print("✓ Redis listener connected successfully")
        async for message in pubsub.listen():
            if message["type"] == "message":
                await manager.broadcast(message["data"])
    except Exception as e:
        print(f"⚠ Redis connection failed: {e}")
        print("Real-time alerts will be disabled. Start Redis with: docker run -d -p 6379:6379 redis")

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(redis_listener())

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "SecuRock SOC API"}

# Register all API routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(organizations.router, prefix="/api/organizations", tags=["organizations"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(ingest.router, prefix="/api/ingest", tags=["ingest"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["incidents"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["subscriptions"])

from prometheus_fastapi_instrumentator import Instrumentator
Instrumentator().instrument(app).expose(app)
