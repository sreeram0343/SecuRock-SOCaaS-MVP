
from sqlalchemy import Column, String, DateTime, ForeignKey, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.models.base import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    plan_tier = Column(String(50), nullable=False)  # trial, basic, premium
    status = Column(String(50), nullable=False, default="active")  # active, cancelled, expired
    started_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)
    meta_data = Column(JSON, default=lambda: {})  # Additional subscription info
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization")
