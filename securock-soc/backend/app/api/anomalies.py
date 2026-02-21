from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from app.api.deps import get_current_user
from app.services.wazuh_client import wazuh_client
from app.services.opensearch import os_client
from app.services.anomaly_engine import anomaly_engine
from app.schemas.incident import DetectionResult

router = APIRouter()

@router.get("", response_model=List[Dict[str, Any]])
async def get_raw_anomalies(current_user: str = Depends(get_current_user)):
    """Fetch recent raw alerts from Wazuh/OpenSearch"""
    logs = os_client.search_logs(index="wazuh-alerts-*", query={"size": 50})
    if not logs:
        logs = wazuh_client.fetch_alerts(limit=50)
    return logs

@router.get("/risk-score/{host}", response_model=Dict[str, Any])
async def get_host_risk_score(host: str, current_user: str = Depends(get_current_user)):
    """Get aggregated risk score for a specific host"""
    query = {
        "query": {
            "match": {
                "agent_name": host
            }
        },
        "size": 100
    }
    logs = os_client.search_logs(index="wazuh-alerts-*", query=query)
    results = anomaly_engine.run_detection(logs)
    
    if not results:
        return {"host": host, "risk_score": 0, "severity": "LOW", "incident_count": 0}
        
    highest_risk = max([r["risk_score"] for r in results])
    severity = "CRITICAL" if highest_risk > anomaly_engine.critical_threshold else "HIGH" if highest_risk > 60 else "MEDIUM" if highest_risk > 30 else "LOW"
    
    return {
        "host": host,
        "risk_score": highest_risk,
        "severity": severity,
        "incident_count": len(results),
        "top_events": results[:5]
    }

@router.post("/run-detection", response_model=List[DetectionResult])
async def run_anomaly_detection(current_user: str = Depends(get_current_user)):
    """Run anomaly detection pipeline manually"""
    logs = os_client.search_logs(index="wazuh-alerts-*", query={"size": 100})
    if not logs:
        logs = wazuh_client.fetch_alerts(limit=100)
        
    results = anomaly_engine.run_detection(logs)
    return results
