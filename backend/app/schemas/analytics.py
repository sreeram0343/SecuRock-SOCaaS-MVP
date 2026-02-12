
from pydantic import BaseModel
from typing import List, Dict, Any

class MetricPoint(BaseModel):
    timestamp: str
    value: int

class SeverityDistribution(BaseModel):
    severity: str
    count: int

class AttackEvent(BaseModel):
    source: List[float]
    destination: List[float]
    value: int

class AnalyticsDashboard(BaseModel):
    total_alerts: int
    total_incidents: int
    open_incidents: int
    mean_time_to_response: float # in minutes
    alerts_over_time: List[MetricPoint]
    severity_distribution: List[SeverityDistribution]
    recent_attacks: List[AttackEvent] = []
