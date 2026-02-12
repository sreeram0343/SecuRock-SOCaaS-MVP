
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.models.base import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    severity = Column(String(20), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    source_ip = Column(String(45), nullable=True)
    destination_ip = Column(String(45), nullable=True)
    event_type = Column(String(100), nullable=True)
    confidence_score = Column(Float, default=0.0)
    status = Column(String(50), default="new")
    mitre_tactic = Column(String(100), nullable=True)
    mitre_technique = Column(String(100), nullable=True)
    raw_data = Column(JSON, default=lambda: {})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    acknowledged_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    acknowledged_at = Column(DateTime, nullable=True)

    organization = relationship("Organization", back_populates="alerts")
    acknowledger = relationship("User", back_populates="acknowledged_alerts")
    incident_associations = relationship("IncidentAlert", back_populates="alert", cascade="all, delete-orphan")
