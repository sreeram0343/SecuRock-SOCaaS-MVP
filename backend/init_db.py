"""
Database initialization script for SecuRock SOC
Creates all tables in the database
"""
import asyncio
import sys
from sqlalchemy.ext.asyncio import create_async_engine

async def init_db():
    """Initialize database by creating all tables"""
    from app.config import settings
    from app.models.base import Base
    # Import all models to register them with Base
    from app.models import user, organization, subscription, alert, incident, playbook, api_key, audit_log
    
    print("=" * 60)
    print("SecuRock SOC - Database Initialization")
    print("=" * 60)
    print(f"Connecting to database: {settings.DATABASE_URL}")
    
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        print("\nCreating all tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("\n✓ All tables created successfully!")
    
    await engine.dispose()
    print("\nDatabase initialization complete!")

if __name__ == "__main__":
    asyncio.run(init_db())

