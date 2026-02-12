
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.alert import Alert
from typing import Dict, Any
import datetime

class CorrelationService:
    async def analyze_log(self, log: Dict[str, Any], db: AsyncSession):
        """
        Analyze log against rules and create alerts if needed.
        """
        event_type = log.get("event_type", "").upper()
        severity = log.get("severity", "INFO").upper()

        is_alert = False
        alert_title = ""
        alert_desc = ""

        # Basic Rules
        if "SUSPICIOUS" in event_type or severity == "HIGH":
            is_alert = True
            alert_title = f"Suspicious Activity Detected: {event_type}"
            alert_desc = f"Detected {event_type} from {log.get('source_ip')}"
        
        elif "FAILED_LOGIN" in event_type:
            # Simple threshold check (stateless for MVP, real would use Redis counters)
            is_alert = True
            alert_title = "Failed Login Attempt"
            alert_desc = f"Failed login for user {log.get('user')} from {log.get('source_ip')}"

        if is_alert:
            # Create Alert
            # Use placeholder Org ID if not present in log
            # In a real system, we'd lookup Org from token/API key associated with log source
            org_id = log.get("organization_id") or "00000000-0000-0000-0000-000000000000"
            
            new_alert = Alert(
                organization_id=org_id,
                severity=severity if severity in ["LOW","MEDIUM","HIGH","CRITICAL"] else "MEDIUM",
                title=alert_title,
                description=alert_desc,
                source_ip=log.get("source_ip"),
                destination_ip=log.get("destination_ip"),
                event_type=event_type,
                status="new",
                raw_data=log
            )
            db.add(new_alert)
            await db.commit()
            print(f"Alert Created: {alert_title}")

            # Push to Redis PubSub for WebSocket
            from app.services.redis_service import redis_service
            import json
            # Convert alert to dict (simplistic)
            alert_payload = {
                "id": new_alert.id, # Might be None until refresh, but okay
                "title": new_alert.title,
                "severity": new_alert.severity,
                "timestamp": str(datetime.datetime.utcnow())
            }
            await redis_service.publish("alerts", json.dumps(alert_payload))

correlation_service = CorrelationService()
