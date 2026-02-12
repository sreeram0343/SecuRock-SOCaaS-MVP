
import aiohttp
import logging

logger = logging.getLogger(__name__)

class ThreatIntelService:
    def __init__(self):
        self.abuseipdb_key = "YOUR_ABUSEIPDB_KEY" # In prod, use env var
        # Simple local blocklist for MVP
        self.blocklist = {
            "192.168.1.100": "Known Malicious Actor",
            "10.0.0.99": "Botnet C2",
        }

    async def check_ip(self, ip_address: str) -> dict:
        """
        Check if an IP is malicious.
        Returns dict with is_malicious (bool) and risk_score (0-100).
        """
        # 1. Check local blocklist
        if ip_address in self.blocklist:
            return {
                "is_malicious": True,
                "risk_score": 100,
                "threat_type": self.blocklist[ip_address],
                "source": "Local Blocklist"
            }
            
        # 2. (Optional) Check public feed (mocked for MVP to avoid external dependencies blocking)
        # In real world: call AbuseIPDB API
        
        # Mock logic for demo purposes
        if ip_address.endswith(".66"):
            return {
                "is_malicious": True,
                "risk_score": 85,
                "threat_type": "Suspicious Activity",
                "source": "Threat Feed"
            }

        return {
            "is_malicious": False,
            "risk_score": 0,
            "threat_type": None,
            "source": None
        }

threat_intel = ThreatIntelService()
