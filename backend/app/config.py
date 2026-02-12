
import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "SecuRock SOC"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "CHANGE_THIS_TO_A_SUPER_SECRET_KEY_IN_PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "password")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "securock")
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}")
    
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    OPENSEARCH_URL: str = os.getenv("OPENSEARCH_URL", "https://wazuh.indexer:9200")
    OPENSEARCH_USER: str = os.getenv("OPENSEARCH_USER", "admin")
    OPENSEARCH_PASSWORD: str = os.getenv("OPENSEARCH_PASSWORD", "admin")
    
    # Subscription Plan Configuration
    TRIAL_PERIOD_DAYS: int = 14
    PLAN_FEATURES: dict = {
        "trial": {
            "max_users": 1,
            "max_alerts_per_month": 100,
            "max_incidents": 10,
            "analytics_enabled": False,
            "api_access": False,
            "custom_playbooks": False,
            "priority_support": False,
            "data_retention_days": 7
        },
        "basic": {
            "max_users": 3,
            "max_alerts_per_month": 1000,
            "max_incidents": 50,
            "analytics_enabled": True,
            "api_access": False,
            "custom_playbooks": False,
            "priority_support": False,
            "data_retention_days": 30
        },
        "premium": {
            "max_users": -1,  # Unlimited
            "max_alerts_per_month": -1,  # Unlimited
            "max_incidents": -1,  # Unlimited
            "analytics_enabled": True,
            "api_access": True,
            "custom_playbooks": True,
            "priority_support": True,
            "data_retention_days": 365
        }
    }

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
