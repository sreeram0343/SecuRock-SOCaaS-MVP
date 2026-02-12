from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Float, Text
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    api_key = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.now)
    
    users = relationship("User", back_populates="organization")
    agents = relationship("Agent", back_populates="organization")
    alerts = relationship("Alert", back_populates="organization")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default="viewer") # admin, viewer
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    
    organization = relationship("Organization", back_populates="users")

class Agent(Base):
    __tablename__ = "agents"
    id = Column(Integer, primary_key=True, index=True)
    hostname = Column(String)
    ip_address = Column(String)
    status = Column(String, default="offline") # online, offline, compromised
    last_heartbeat = Column(DateTime, default=datetime.now)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    
    organization = relationship("Organization", back_populates="agents")

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.now)
    severity = Column(String) # critical, high, medium, low
    attack_type = Column(String)
    details = Column(Text)
    action_taken = Column(String)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=True)
    
    organization = relationship("Organization", back_populates="alerts")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.now)
    action = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    details = Column(String)
