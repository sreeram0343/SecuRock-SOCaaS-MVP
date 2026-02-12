
import redis.asyncio as redis
from app.config import settings
import json

class RedisService:
    def __init__(self):
        self.redis_url = settings.REDIS_URL
        self.redis = None

    async def connect(self):
        if not self.redis:
            self.redis = redis.from_url(self.redis_url, encoding="utf-8", decode_responses=True)

    async def close(self):
        if self.redis:
            await self.redis.close()

    async def push_log(self, queue_name: str, log_data: dict):
        await self.connect()
        await self.redis.rpush(queue_name, json.dumps(log_data))

    async def pop_log(self, queue_name: str):
        await self.connect()
        # blpop returns a tuple (queue_name, data) or None
        item = await self.redis.blpop(queue_name, timeout=1)
        if item:
            return json.loads(item[1])
        return None

    async def publish(self, channel: str, message: str):
        await self.connect()
        await self.redis.publish(channel, message)
    
    def get_redis(self):
        return self.redis

redis_service = RedisService()
