
from datetime import datetime
from typing import Dict, Any

class NormalizationService:
    def normalize_log(self, raw_log: Dict[str, Any]) -> Dict[str, Any]:
        """
        Standardize log format.
        """
        normalized = {
            "timestamp": raw_log.get("timestamp") or datetime.utcnow().isoformat(),
            "source_ip": raw_log.get("source_ip"),
            "destination_ip": raw_log.get("destination_ip"),
            "event_type": raw_log.get("event_type", "UNKNOWN"),
            "severity": raw_log.get("severity", "INFO"), # Might need mapping
            "message": raw_log.get("message", ""),
            "raw_data": raw_log,
            "processed_at": datetime.utcnow().isoformat()
        }
        
        # Simple enrichment or parsing logic could go here
        
        return normalized

normalization_service = NormalizationService()
