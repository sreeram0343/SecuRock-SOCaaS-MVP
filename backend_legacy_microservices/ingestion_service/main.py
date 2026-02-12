from fastapi import FastAPI, HTTPException, status
import redis
import os
import json
from shared.schemas import LogEntry

app = FastAPI(title="SecuRock Ingestion Service")

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

try:
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)
except Exception as e:
    print(f"Error connecting to Redis: {e}")

@app.post("/logs", status_code=status.HTTP_201_CREATED)
def ingest_log(log: LogEntry):
    try:
        # Normalize and serialize
        log_data = log.model_dump_json() # pydantic v2
        # Push to Redis Queue 'logs_queue'
        r.rpush("logs_queue", log_data)
        return {"status": "received"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    try:
        r.ping()
        return {"redis": "ok"}
    except:
        return {"redis": "error"}
