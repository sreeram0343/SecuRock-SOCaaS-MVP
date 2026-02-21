from opensearchpy import OpenSearch
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class OpenSearchClient:
    def __init__(self):
        self.client = OpenSearch(
            hosts=[settings.OPENSEARCH_URL],
            http_auth=(settings.OPENSEARCH_USER, settings.OPENSEARCH_PASS),
            use_ssl=False,
            verify_certs=False,
            ssl_show_warn=False
        )

    def search_logs(self, index: str = "wazuh-alerts-*", query: dict = None):
        if query is None:
            query = {"query": {"match_all": {}}}
        try:
            response = self.client.search(index=index, body=query)
            # return normalized JSON format
            hits = response.get("hits", {}).get("hits", [])
            return [hit.get("_source", {}) for hit in hits]
        except Exception as e:
            logger.error(f"OpenSearch query failed: {e}")
            return []

os_client = OpenSearchClient()
