from sqlalchemy import Column, Integer, String, DateTime
from .database import Base
from datetime import datetime

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    severity = Column(String)
    source_ip = Column(String)
    status = Column(String, default="OPEN")
    timestamp = Column(DateTime, default=datetime.utcnow)
