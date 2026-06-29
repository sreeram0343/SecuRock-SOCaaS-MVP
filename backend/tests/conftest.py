import os
import sys
import pytest
import asyncio
from typing import AsyncGenerator

# Add backend directory to sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Override environment variables for test execution
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
os.environ["REDIS_URL"] = "redis://localhost:6379"
os.environ["SECRET_KEY"] = "testsecretkeytestsecretkeytestsecretkey"

import sqlalchemy.dialects.postgresql as pg_dialect
import sqlalchemy.types as types
import uuid

# Define a custom GUID class that works seamlessly with SQLite
class GUID(types.TypeDecorator):
    impl = types.String(36)
    cache_ok = True

    def load_dialect_impl(self, dialect):
        return dialect.type_descriptor(types.String(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if isinstance(value, uuid.UUID):
            return value
        try:
            return uuid.UUID(str(value))
        except Exception:
            try:
                return uuid.UUID(hex=str(value))
            except Exception:
                return None

pg_dialect.UUID = GUID

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.models.base import Base
from app.database import get_db
from app.main import app

# Create test engine using SQLite in-memory database
test_engine = create_async_engine(
    os.environ["DATABASE_URL"],
    connect_args={"check_same_thread": False}
)
TestSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session", autouse=True)
async def initialize_test_database():
    """Initialize database tables before starting the test session."""
    # Import all models to register them on Base
    from app.models import user, organization, subscription, alert, incident, playbook, api_key, audit_log
    
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield
    
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await test_engine.dispose()

@pytest.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Provide a transactional database session for a single test."""
    async with TestSessionLocal() as session:
        yield session
        # Rollback changes to ensure isolation between tests
        await session.rollback()

@pytest.fixture(autouse=True)
async def cleanup_database(db_session):
    """Clear database records after each test run to guarantee isolation."""
    yield
    from app.models.alert import Alert
    from app.models.organization import Organization
    from app.models.user import User
    from sqlalchemy import delete
    
    # Run delete queries
    await db_session.execute(delete(Alert))
    await db_session.execute(delete(Organization))
    await db_session.execute(delete(User))
    await db_session.commit()

@pytest.fixture(autouse=True)
async def override_get_db(db_session):
    """Override the dependency injection get_db with the test db session."""
    async def _get_test_db():
        yield db_session
    
    app.dependency_overrides[get_db] = _get_test_db
    yield
    app.dependency_overrides.clear()
