from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "SecuRock SOC API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-prod")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    
    # OpenSearch
    OPENSEARCH_URL: str = os.getenv("OPENSEARCH_URL", "http://opensearch:9200")
    OPENSEARCH_USER: str = os.getenv("OPENSEARCH_USER", "admin")
    OPENSEARCH_PASS: str = os.getenv("OPENSEARCH_PASS", "admin")
    
    # Wazuh
    WAZUH_URL: str = os.getenv("WAZUH_URL", "https://wazuh:55000")
    WAZUH_USER: str = os.getenv("WAZUH_USER", "wazuh-wui")
    WAZUH_PASS: str = os.getenv("WAZUH_PASS", "wazuh-wui")
    
    # LLM
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

settings = Settings()
