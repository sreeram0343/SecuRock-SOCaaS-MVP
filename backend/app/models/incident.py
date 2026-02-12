
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.models.base import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(String(20), nullable=False)
    status = Column(String(50), default="new")
    priority = Column(String(20), default="medium")
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    resolution_notes = Column(Text, nullable=True)

    organization = relationship("Organization", back_populates="incidents")
    creator = relationship("User", foreign_keys=[created_by], back_populates="created_incidents")
    assignee = relationship("User", foreign_keys=[assigned_to], back_populates="assigned_incidents")
    alert_associations = relationship("IncidentAlert", back_populates="incident", cascade="all, delete-orphan")

class IncidentAlert(Base):
    __tablename__ = "incident_alerts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    alert_id = Column(UUID(as_uuid=True), ForeignKey("alerts.id", ondelete="CASCADE"), nullable=False)
    added_at = Column(DateTime, default=datetime.utcnow)

    incident = relationship("Incident", back_populates="alert_associations")
    alert = relationship("Alert", back_populates="incident_associations")

    # Composite unique constraint is handled in DB migration or __table_args__ if needed, 
    # but SQLAlchemy allows defining it here too but for brevity we follow the schema sql.
