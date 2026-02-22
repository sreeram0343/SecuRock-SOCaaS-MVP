from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.models.alert import Alert
from app.models.incident import Incident
from pydantic import BaseModel
import random

router = APIRouter()

class DemoAttackRequest(BaseModel):
    attack_type: str # 'brute_force', 'sql_injection', 'malware'

@router.get("/dashboard")
async def get_dashboard_metrics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    org_id = current_user.organization_id

    # 1. Total Alerts
    total_alerts_result = await db.execute(
        select(func.count(Alert.id)).where(Alert.organization_id == org_id)
    )
    total_alerts = total_alerts_result.scalar_one_or_none() or 0

    # 2. Total & Open Incidents
    incidents_result = await db.execute(
        select(Incident.status).where(Incident.organization_id == org_id)
    )
    incidents = incidents_result.scalars().all()
    total_incidents = len(incidents)
    open_incidents = sum(1 for status in incidents if status != 'resolved')

    # 3. Severity Distribution
    severity_result = await db.execute(
        select(Alert.severity, func.count(Alert.id))
        .where(Alert.organization_id == org_id)
        .group_by(Alert.severity)
    )
    severity_distribution = [
        {"severity": row[0], "count": row[1]} for row in severity_result.all()
    ]
    
    # Fill missing severities
    existing_severities = {item["severity"] for item in severity_distribution}
    for sev in ["critical", "high", "medium", "low"]:
        if sev not in existing_severities:
            severity_distribution.append({"severity": sev, "count": 0})

    return {
        "total_alerts": total_alerts,
        "total_incidents": total_incidents,
        "open_incidents": open_incidents,
        "mean_time_to_response": 45.5, # Static for MVP
        "alerts_over_time": [
            {"timestamp": "2024-01-01", "value": max(10, total_alerts // 4)},
            {"timestamp": "2024-01-02", "value": max(15, total_alerts // 3)},
            {"timestamp": "2024-01-03", "value": total_alerts}
        ],
        "severity_distribution": severity_distribution,
        "recent_attacks": [
            {"source": [-74.006, 40.7128], "destination": [2.3522, 48.8566], "value": 1},
            {"source": [37.6173, 55.7558], "destination": [-0.1278, 51.5074], "value": 1},
            {"source": [139.6917, 35.6895], "destination": [-122.4194, 37.7749], "value": 1},
            {"source": [-43.1729, -22.9068], "destination": [151.2093, -33.8688], "value": 1}
        ]
    }

@router.post("/demo-attack")
async def trigger_demo_attack(
    request: DemoAttackRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate a fake alert/incident for live dashboard demos."""
    org_id = current_user.organization_id
    
    attack_map = {
        'brute_force': {
            'title': 'Multiple Failed Login Attempts',
            'severity': 'medium',
            'desc': 'Detected sequence of failed authentication attempts from multiple residential IPs.',
            'type': 'Authentication'
        },
        'sql_injection': {
            'title': 'SQL Injection Payload Detected',
            'severity': 'high',
            'desc': 'WAF blocked an attempt to enumerate database schemas on the customer portal.',
            'type': 'Web Attack'
        },
        'malware': {
            'title': 'Ransomware Execution Blocked',
            'severity': 'critical',
            'desc': 'EDR terminated a process attempting to encrypt user directories.',
            'type': 'Malware'
        }
    }
    
    details = attack_map.get(request.attack_type, attack_map['brute_force'])
    
    # Insert new Alert
    new_alert = Alert(
        organization_id=org_id,
        title=f"DEMO: {details['title']}",
        description=details['desc'],
        severity=details['severity'],
        event_type=details['type'],
        confidence_score=random.uniform(0.7, 0.99),
        status='new'
    )
    
    db.add(new_alert)
    await db.commit()
    await db.refresh(new_alert)
    
    return {"message": "Demo attack triggered successfully", "alert_id": str(new_alert.id)}
