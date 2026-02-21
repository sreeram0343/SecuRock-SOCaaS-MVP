from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class AlertInput(BaseModel):
    rule_id: str
    description: str
    level: int
    agent_id: str
    agent_name: str
    timestamp: str
    full_log: str

class DetectionResult(BaseModel):
    host: str
    event: str
    anomaly_score: float
    risk_score: float
    severity: str

class IncidentNarrativeRequest(BaseModel):
    host: str
    incidents: List[Dict[str, Any]]
    risk_score: float
    severity: str

class IncidentNarrativeResponse(BaseModel):
    executive_summary: str
    timeline: List[str]
    risk_justification: str
    recommended_action: str
