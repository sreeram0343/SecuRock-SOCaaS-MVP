# SecuRock AI SOCaaS - MVP

SecuRock AI SOC is a zero-cost, containerized, and AI-powered Autonomous SOC MVP. It ingests data from Wazuh, stores logs in OpenSearch, runs scikit-learn anomaly detection (Isolation Forest), generates incident narratives using an LLM, and visualizes risks on a modern Next.js dark-themed dashboard.

## 🏗️ Architecture Overview

The system runs entirely via Docker Compose and consists of 5 core services:
1. **Frontend**: Next.js (React) + Tailwind CSS dashboard.
2. **Backend**: FastAPI orchestrating the AI Engine, LLM, Wazuh APIs, and OpenSearch.
3. **Wazuh Manager**: Open-source SIEM / XDR for alert generation.
4. **OpenSearch**: Log storage and indexing.
5. **Logstash**: Ships alerts from Wazuh to OpenSearch.

### Core Workflows
* **Data Ingestion**: Wazuh agent logs -> Wazuh Manager -> Logstash -> OpenSearch.
* **Anomaly Engine**: FastAPI backend queries OpenSearch/Wazuh, extracts features, and scores risk using a scikit-learn Isolation Forest model.
* **Narrative Generator**: Critical anomalies trigger the LLM to generate an executive structured incident response narrative.

## 🚀 Setup Instructions

1. **Clone & Configure**
   Create a `.env` file in the `backend/` directory or pass environments via docker-compose:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ADMIN_USER=admin
   ADMIN_PASS=admin123
   ```

2. **Launch Infrastructure**
   ```bash
   cd securock-soc
   docker-compose up --build -d
   ```

3. **Access Services**
   - **SOC Dashboard**: [http://localhost:3000](http://localhost:3000)
   - **Backend API Docs**: [http://localhost:8000/api/v1/openapi.json](http://localhost:8000/api/v1/openapi.json)

## 🔮 Future Improvements
- **Real-time WebSockets**: Push anomaly updates to the frontend dashboard.
- **Production DB**: Integrate PostgreSQL for persistent user and incident management.
- **Advanced ML**: Implement LSTM auto-encoders for sequence-based anomaly detection.
- **Wazuh Agents**: Automate deployment of Wazuh agents to endpoints.
