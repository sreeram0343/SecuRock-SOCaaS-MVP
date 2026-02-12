
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.models.base import Base

class Playbook(Base):
    __tablename__ = "playbooks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    trigger_conditions = Column(JSON, nullable=False)
    actions = Column(JSON, nullable=False)
    is_enabled = Column(Boolean, default=True)
    execution_count = Column(Integer, default=0)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization", back_populates="playbooks")
    executions = relationship("PlaybookExecution", back_populates="playbook", cascade="all, delete-orphan")

class PlaybookExecution(Base):
    __tablename__ = "playbook_executions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    playbook_id = Column(UUID(as_uuid=True), ForeignKey("playbooks.id", ondelete="CASCADE"), nullable=False)
    alert_id = Column(UUID(as_uuid=True), ForeignKey("alerts.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(50), nullable=False)
    result = Column(JSON, default=lambda: {})
    error_message = Column(Text, nullable=True)
    executed_at = Column(DateTime, default=datetime.utcnow)

    playbook = relationship("Playbook", back_populates="executions")
