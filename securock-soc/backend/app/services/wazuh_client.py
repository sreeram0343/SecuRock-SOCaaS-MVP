import requests
import urllib3
from app.core.config import settings
import logging

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
logger = logging.getLogger(__name__)

class WazuhClient:
    def __init__(self):
        self.base_url = settings.WAZUH_URL
        self.user = settings.WAZUH_USER
        self.password = settings.WAZUH_PASS
        self.token = None

    def authenticate(self):
        try:
            auth_str = f"{self.user}:{self.password}"
            import base64
            encoded_bytes = base64.b64encode(auth_str.encode("utf-8"))
            encoded_str = str(encoded_bytes, "utf-8")
            
            headers = {"Authorization": f"Basic {encoded_str}"}
            response = requests.get(f"{self.base_url}/security/user/authenticate", headers=headers, verify=False)
            response.raise_for_status()
            self.token = response.json().get("data", {}).get("token")
        except Exception as e:
            logger.error(f"Wazuh authentication failed: {e}")
            self.token = None

    def get_headers(self):
        if not self.token:
            self.authenticate()
        return {"Authorization": f"Bearer {self.token}"}

    def fetch_alerts(self, limit: int = 100):
        try:
            response = requests.get(
                f"{self.base_url}/security/alerts", 
                headers=self.get_headers(), 
                params={"limit": limit},
                verify=False
            )
            response.raise_for_status()
            return response.json().get("data", {}).get("items", [])
        except Exception as e:
            logger.error(f"Failed to fetch Wazuh alerts: {e}")
            return []

wazuh_client = WazuhClient()
