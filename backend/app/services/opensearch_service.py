from opensearchpy import AsyncOpenSearch
from app.config import settings
from typing import Dict, Any

class OpenSearchService:
    def __init__(self):
        self.client = AsyncOpenSearch(
            hosts=[settings.OPENSEARCH_URL],
            http_auth=(settings.OPENSEARCH_USER, settings.OPENSEARCH_PASSWORD),
            use_ssl=True,
            verify_certs=False,
            ssl_show_warn=False
        )

    async def create_index(self, index_name: str):
        if not await self.client.indices.exists(index=index_name):
            await self.client.indices.create(index=index_name)

    async def index_document(self, index_name: str, document: Dict[str, Any]):
        response = await self.client.index(index=index_name, body=document)
        return response

    async def search(self, index_name: str, query: Dict[str, Any]):
        response = await self.client.search(index=index_name, body=query)
        return response['hits']['hits']

    async def close(self):
        await self.client.close()

es_service = OpenSearchService()
