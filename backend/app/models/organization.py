
from sqlalchemy import Column, String, Boolean, DateTime, CheckConstraint, text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.models.base import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    plan = Column(String(50), nullable=False, default="trial")
    plan_tier = Column(String(50), nullable=False, default="trial")  # trial, basic, premium
    trial_end_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    settings = Column(JSON, default=lambda: {})
    # Subscription limits
    max_users = Column(String(50), default="1")  # -1 for unlimited
    max_alerts_per_month = Column(String(50), default="100")  # -1 for unlimited
    features = Column(JSON, default=lambda: {})  # Plan-specific features
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="organization", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="organization", cascade="all, delete-orphan")
    playbooks = relationship("Playbook", back_populates="organization", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="organization", cascade="all, delete-orphan")
    api_keys = relationship("ApiKey", back_populates="organization", cascade="all, delete-orphan")
