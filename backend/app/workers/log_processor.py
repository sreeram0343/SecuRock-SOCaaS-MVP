
import asyncio
import json
from app.services.redis_service import redis_service
from app.services.opensearch_service import es_service
from app.services.ai_service import ai_service

from app.database import AsyncSessionLocal
from app.services.correlation_service import correlation_service

from app.services.ml_service import ml_service
from app.services.threat_intel import threat_intel

async def process_logs():
    print("Starting Log Processor Worker...")
    await es_service.create_index("logs")
    
    while True:
        try:
            # Pop from Redis
            log_data = await redis_service.pop_log("logs_queue")
            
            if log_data:
                # 1. Threat Intelligence Check
                source_ip = log_data.get("source_ip")
                ti_result = await threat_intel.check_ip(source_ip)
                
                log_data["threat_intel"] = ti_result
                
                # 2. ML Anomaly Detection
                # Extract features from metadata or defaults
                # Features: [packet_size, duration, request_rate]
                meta = log_data.get("metadata", {})
                features = [
                    meta.get("packet_size", 0),
                    meta.get("duration", 0),
                    meta.get("rate", 0)
                ]
                
                anomaly_score = ml_service.predict_anomaly(features)
                log_data["anomaly_score"] = anomaly_score
                
                # logic to boost risk score if anomaly or threat detected
                base_risk = 0.0
                if ti_result["is_malicious"]:
                    base_risk += 0.8
                if anomaly_score > 0.7:
                    base_risk += 0.5
                    
                final_risk = min(base_risk, 1.0)
                log_data["risk_score"] = final_risk

                # 3. LLM Analysis (Optional/As needed for high risk)
                if final_risk > 0.5:
                    try:
                        risk_assessment = await ai_service.analyze_log(log_data)
                        log_data["ai_narrative"] = risk_assessment.narrative
                        log_data["remediation"] = risk_assessment.remediation_steps
                    except Exception as e:
                        print(f"AI Error: {e}")
                        log_data["ai_narrative"] = "AI Analysis failed."

                # Index to OpenSearch
                await es_service.index_document("logs", log_data)
                print(f"Indexed log: {log_data.get('event_type')} | Risk: {log_data.get('risk_score')}")
                
                # Correlate
                async with AsyncSessionLocal() as db:
                    await correlation_service.analyze_log(log_data, db)
                    
            else:
                await asyncio.sleep(0.1)
                
        except Exception as e:
            print(f"Error processing log: {e}")
            await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(process_logs())
