
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.models.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    email = Column(String(255), nullable=False) # Unique constraint in table args
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="viewer")
    is_active = Column(Boolean, default=True)
    email_verified = Column(Boolean, default=False)
    verification_token = Column(String(255), nullable=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")
    created_incidents = relationship("Incident", foreign_keys="[Incident.created_by]", back_populates="creator")
    assigned_incidents = relationship("Incident", foreign_keys="[Incident.assigned_to]", back_populates="assignee")
    acknowledged_alerts = relationship("Alert", back_populates="acknowledger")

    __table_args__ = (
        UniqueConstraint('organization_id', 'email', name='unique_email_per_org'),
    )
