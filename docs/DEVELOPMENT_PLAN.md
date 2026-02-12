# SecuRock SOC MVP - Complete Development Plan

**Version:** 1.0  
**Last Updated:** February 2026  
**Prepared for:** SecuRock Technologies  
**Founder:** Sreeram M R

---

## Table of Contents

1. [MVP Feature Scope & Specifications](#1-mvp-feature-scope--specifications)
2. [System Architecture Design](#2-system-architecture-design)
3. [Technology Stack Recommendations](#3-technology-stack-recommendations)
4. [AI/ML Development Implementation Plan](#4-aiml-development-implementation-plan)
5. [Security & Compliance Design](#5-security--compliance-design)
6. [MVP Development Timeline](#6-mvp-development-timeline)
7. [Team Structure & Role Definitions](#7-team-structure--role-definitions)
8. [Budget Estimation & Resource Planning](#8-budget-estimation--resource-planning)
9. [Pilot Deployment Strategy](#9-pilot-deployment-strategy)
10. [Success Metrics & KPIs](#10-success-metrics--kpis)
11. [Investor Readiness Checklist](#11-investor-readiness-checklist)
12. [Risk Analysis & Mitigation Strategies](#12-risk-analysis--mitigation-strategies)

---

## 1. MVP Feature Scope & Specifications

### 1.1 Log Ingestion System

| Feature | Specification | Priority |
|---------|--------------|----------|
| **Endpoint Log Sources** | Windows Event Logs, Syslog (RFC 5424), Application Logs (JSON, CEF) | Must-have |
| **Network Log Sources** | Firewall logs (Palo Alto, Fortinet), IDS/IPS (Snort, Suricata) | Should-have |
| **Cloud Log Sources** | AWS CloudTrail, Azure Activity Logs, GCP Audit Logs | Nice-to-have |
| **Log Formats** | JSON, Syslog, CEF, LEEF, Custom parsers | Must-have |
| **Throughput** | 1,000 events/second (MVP), scalable to 10,000 EPS | Must-have |
| **Agent-based Collection** | Lightweight Python/Go agent for endpoints | Must-have |
| **Agentless Collection** | Syslog receiver, API polling | Should-have |

### 1.2 SIEM Correlation Engine

| Feature | Specification | Priority |
|---------|--------------|----------|
| **Rule-based Correlation** | YAML-based rule definitions, pattern matching | Must-have |
| **Time-window Analysis** | Sliding windows (5s, 1m, 5m, 1h) | Must-have |
| **Pattern Matching** | Regex, field matching, threshold triggers | Must-have |
| **Baseline Profiling** | User/host behavior baselines | Should-have |
| **Alert Aggregation** | Deduplication within 5-minute windows | Must-have |

### 1.3 AI Anomaly Detection

| Use Case | Detection Method | Priority |
|----------|-----------------|----------|
| **Brute Force Attacks** | Login frequency anomaly | Must-have |
| **Lateral Movement** | Network connection pattern analysis | Must-have |
| **Privilege Escalation** | Unusual admin activity detection | Should-have |
| **Data Exfiltration** | Transfer volume anomaly | Should-have |
| **Malware Activity** | Process behavior analysis | Nice-to-have |

**Performance Targets:**
- Detection Latency: < 5 seconds (p95)
- Accuracy (Precision): > 85%
- False Positive Rate: < 15%

### 1.4 Alert & Notification System

| Severity | Response SLA | Notification Channels |
|----------|-------------|----------------------|
| **Critical** | Immediate | SMS, Email, In-app, Webhook |
| **High** | < 15 min | Email, In-app, Webhook |
| **Medium** | < 1 hour | In-app, Webhook |
| **Low** | < 24 hours | In-app |

### 1.5 Dashboard & Visualization

| Widget | Description | Priority |
|--------|-------------|----------|
| **Threat Overview** | Active threats, severity distribution | Must-have |
| **Alert Timeline** | Real-time alert stream with filters | Must-have |
| **System Health** | Log ingestion rates, service status | Must-have |
| **Top Attackers** | IP addresses with most alerts | Should-have |
| **Detection Trends** | 24h/7d/30d trend charts | Should-have |
| **Geo-IP Map** | Attack source visualization | Nice-to-have |

### 1.6 Incident Management

| Feature | Specification | Priority |
|---------|--------------|----------|
| **Incident Creation** | Manual + auto from critical alerts | Must-have |
| **Case Lifecycle** | New → Assigned → Investigating → Resolved → Closed | Must-have |
| **Notes & Evidence** | Attach logs, screenshots, notes | Must-have |
| **Playbooks** | Basic investigation templates (3-5 playbooks) | Should-have |
| **SLA Tracking** | Response time monitoring | Nice-to-have |

### 1.7 Automated Response Actions

| Action | Execution Method | Priority |
|--------|-----------------|----------|
| **Block IP** | Firewall API integration | Must-have |
| **Isolate Host** | Agent-based network isolation | Should-have |
| **Disable Account** | AD/LDAP API integration | Should-have |
| **Kill Process** | Agent command execution | Nice-to-have |
| **Alert Admin** | Multi-channel notification | Must-have |

---

## 2. System Architecture Design

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LOG SOURCES                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Windows  │  │  Linux   │  │ Firewall │  │  Cloud   │  │  Custom  │      │
│  │  Agents  │  │  Agents  │  │  Logs    │  │  Logs    │  │   Apps   │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │             │             │             │             │             │
│       └─────────────┴──────┬──────┴─────────────┴─────────────┘             │
│                            │                                                 │
│                            ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     INGESTION LAYER                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │   │
│  │  │ REST API    │  │ Syslog      │  │ Kafka       │                  │   │
│  │  │ Receiver    │  │ Receiver    │  │ Consumer    │                  │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                  │   │
│  └─────────┴────────────────┴────────────────┴──────────────────────────┘   │
│                            │                                                 │
│                            ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     MESSAGE QUEUE (Redis)                            │   │
│  └────────────────────────────────┬────────────────────────────────────┘   │
│                                   │                                          │
│            ┌──────────────────────┼──────────────────────┐                  │
│            ▼                      ▼                      ▼                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │ NORMALIZATION    │  │ CORRELATION      │  │ AI DETECTION     │          │
│  │ SERVICE          │  │ ENGINE           │  │ SERVICE          │          │
│  │ - Parsing        │  │ - Rule matching  │  │ - Feature extract│          │
│  │ - Field mapping  │  │ - Time windows   │  │ - Model inference│          │
│  │ - Enrichment     │  │ - Pattern detect │  │ - Scoring        │          │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘          │
│           │                     │                     │                     │
│           └─────────────────────┴─────────────────────┘                     │
│                                 │                                            │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     ALERT SERVICE                                    │   │
│  │  - Alert generation      - Deduplication     - WebSocket broadcast  │   │
│  └────────────────────────────────┬────────────────────────────────────┘   │
│                                   │                                          │
│           ┌───────────────────────┼───────────────────────┐                 │
│           ▼                       ▼                       ▼                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │ PostgreSQL       │  │ Elasticsearch    │  │ Redis            │          │
│  │ - Users          │  │ - Raw logs       │  │ - Cache          │          │
│  │ - Alerts         │  │ - Search index   │  │ - Sessions       │          │
│  │ - Incidents      │  │ - Analytics      │  │ - Queue          │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     API GATEWAY (Nginx)                              │   │
│  │  - Load balancing    - Rate limiting    - SSL termination           │   │
│  └────────────────────────────────┬────────────────────────────────────┘   │
│                                   │                                          │
│                                   ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     FRONTEND (React Dashboard)                       │   │
│  │  - Real-time alerts   - Log search    - Incident management         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow Pipeline

1. **Collection**: Agents/receivers collect logs from sources
2. **Ingestion**: REST API/Syslog receivers accept logs
3. **Queuing**: Logs pushed to Redis queue for async processing
4. **Normalization**: Parsing, field extraction, timestamp normalization
5. **Enrichment**: GeoIP lookup, threat intel correlation
6. **Storage**: Elasticsearch for logs, PostgreSQL for metadata
7. **Analysis**: Parallel processing by Correlation Engine and AI Service
8. **Alerting**: Alert generation, deduplication, notification
9. **Visualization**: Real-time dashboard updates via WebSocket

### 2.3 Service Communication

| Source Service | Target Service | Protocol | Purpose |
|----------------|----------------|----------|---------|
| Ingestion | Redis | Redis Protocol | Log queuing |
| Normalization | Elasticsearch | REST | Log storage |
| AI Service | Alert Service | REST | Alert creation |
| Frontend | API Gateway | WebSocket | Real-time updates |
| All Services | Auth Service | REST | Token validation |

---

## 3. Technology Stack Recommendations

| Component | Technology | Version | Justification |
|-----------|------------|---------|---------------|
| **Backend Framework** | FastAPI | 0.104+ | High performance async Python framework, automatic OpenAPI docs, ideal for real-time systems |
| **Programming Language** | Python | 3.11+ | Excellent ML ecosystem, rapid development, large talent pool in India |
| **Log Ingestion** | Custom REST + Syslog | - | FastAPI for REST, syslog-ng for syslog; simple, reliable |
| **Message Queue** | Redis Streams | 7.0+ | Lightweight, fast, sufficient for MVP; easy migration to Kafka later |
| **Time-Series Database** | Elasticsearch | 8.8+ | Industry standard for log analytics, built-in full-text search |
| **Relational Database** | PostgreSQL | 15+ | Robust, open-source, excellent for structured data |
| **Cache Layer** | Redis | 7.0+ | In-memory caching, session storage, rate limiting |
| **AI/ML Framework** | Scikit-learn / PyTorch | 1.3 / 2.0 | Scikit-learn for classical ML, PyTorch for deep learning |
| **Model Serving** | FastAPI (integrated) | - | Avoid extra infra; serve models directly from detection service |
| **Frontend Framework** | React | 18.2+ | Popular, large ecosystem, excellent for dashboards |
| **UI Component Library** | TailwindCSS + Shadcn/UI | 3.3 / Latest | Modern, customizable, great developer experience |
| **Real-time Communication** | WebSocket (native) | - | Built into FastAPI, no additional dependencies |
| **Containerization** | Docker | 24+ | Industry standard, consistent environments |
| **Orchestration** | Docker Compose (MVP) | 2.20+ | Simple for MVP; Kubernetes post-MVP |
| **CI/CD** | GitHub Actions | - | Free for public repos, integrated with GitHub |
| **Cloud Platform** | AWS / DigitalOcean | - | AWS for scale, DigitalOcean for cost-effective MVP |
| **Monitoring** | Prometheus + Grafana | Latest | Open-source, powerful, widely adopted |

**Licensing Notes:**
- All core components are open-source (Apache 2.0, MIT, BSD)
- Elasticsearch: Elastic License 2.0 (free for self-hosted)
- No licensing costs for MVP

---

## 4. AI/ML Development Implementation Plan

### Phase 1: Data Collection & Preparation

**Data Sources:**
| Dataset | Type | Size | Use Case |
|---------|------|------|----------|
| **CICIDS2017** | Network traffic | 15GB | Intrusion detection training |
| **NSL-KDD** | Network flows | 150K records | Anomaly detection baseline |
| **LANL Unified Host** | Auth logs | 1B events | Authentication anomaly |
| **Synthetic Logs** | Custom generated | Variable | Edge cases, testing |

**Preprocessing Pipeline:**
```python
# Pseudocode for preprocessing
class LogPreprocessor:
    def clean(self, log):
        # Remove nulls, fix timestamps
        return cleaned_log
    
    def normalize(self, log):
        # Standardize fields across formats
        return normalized_log
    
    def extract_features(self, log):
        features = {
            'hour_of_day': log.timestamp.hour,
            'day_of_week': log.timestamp.weekday(),
            'source_ip_freq': self.ip_frequency(log.source_ip),
            'event_type_encoded': self.encode(log.event_type),
            'message_length': len(log.message),
            'is_weekend': log.timestamp.weekday() >= 5,
        }
        return features
```

### Phase 2: Feature Engineering

**Log-based Features:**
- Event frequency (per host, per user)
- Time delta between events
- Session duration patterns
- Failed/success ratios

**Network Features:**
- Unique destination IPs per source
- Bytes transferred per connection
- Port usage patterns
- Connection duration

**Behavioral Features:**
- Working hours deviation
- Access pattern anomaly score
- Privilege usage frequency

### Phase 3: Model Development

**Primary Model: Isolation Forest**
```python
from sklearn.ensemble import IsolationForest

class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(
            n_estimators=100,
            contamination=0.1,
            random_state=42,
            n_jobs=-1
        )
    
    def train(self, X_train):
        self.model.fit(X_train)
        
    def predict(self, X):
        # Returns: 1 for normal, -1 for anomaly
        return self.model.predict(X)
    
    def score(self, X):
        # Returns anomaly score (lower = more anomalous)
        return self.model.decision_function(X)
```

**Secondary Model: LSTM for Sequence Analysis**
- Use for detecting attack sequences
- Input: Sequence of 10 recent events
- Output: Next event prediction + anomaly flag

### Phase 4: Model Training & Validation

**Training Setup:**
- 80% training, 10% validation, 10% test split
- 5-fold cross-validation
- Grid search for hyperparameters

**Performance Targets:**
| Metric | Target | Acceptable |
|--------|--------|------------|
| Precision | > 85% | > 80% |
| Recall | > 80% | > 75% |
| F1-Score | > 82% | > 77% |
| AUC-ROC | > 0.90 | > 0.85 |

### Phase 5: Inference Deployment

**Serving Architecture:**
- Models loaded at service startup
- Feature extraction in real-time
- Batch inference for historical analysis
- Model versioning with timestamps

**Latency Optimization:**
- Pre-compute IP frequency tables
- Cache common feature calculations
- Use numpy for vectorized operations

### Phase 6: Continuous Learning

**Feedback Loop:**
1. Analyst marks alert as True/False Positive
2. Feedback stored in database
3. Weekly retraining with new labels
4. A/B test new model vs current
5. Automatic rollout if improved

---

## 5. Security & Compliance Design

### 5.1 Encryption Strategy

| Layer | Method | Details |
|-------|--------|---------|
| **Data at Rest** | AES-256 | PostgreSQL: pgcrypto, Elasticsearch: encrypted-at-rest |
| **Data in Transit** | TLS 1.3 | All internal and external communication |
| **Secrets** | HashiCorp Vault / AWS Secrets Manager | API keys, DB credentials, JWT secrets |
| **Key Rotation** | 90 days | Automated rotation for production |

### 5.2 Authentication & Authorization

**RBAC Model:**
| Role | Permissions |
|------|------------|
| **Admin** | Full access, user management, system config |
| **Analyst** | View alerts, manage incidents, run queries |
| **Viewer** | Read-only dashboard access |
| **API User** | Programmatic access via API keys |

**Authentication Flow:**
```
1. User submits credentials
2. Auth Service validates against PostgreSQL
3. JWT token generated (15 min access, 7 day refresh)
4. Token includes: user_id, role, permissions
5. API Gateway validates token on each request
```

### 5.3 API Security

| Protection | Implementation |
|------------|----------------|
| **Rate Limiting** | 100 req/min per user, 1000 req/min per IP |
| **Input Validation** | Pydantic models, strict schemas |
| **SQL Injection** | ORM (SQLAlchemy), parameterized queries |
| **XSS/CSRF** | React escaping, SameSite cookies |
| **CORS** | Whitelist allowed origins |

### 5.4 Audit Logging

All security-relevant actions logged:
- Login attempts (success/failure)
- Permission changes
- Data exports
- Configuration changes
- API access patterns

---

## 6. MVP Development Timeline

### Week 1-2: Foundation & Setup ✓

- [x] Development environment setup
- [x] Repository structure and CI/CD pipeline
- [x] Architecture finalization
- [x] Database schema design
- [x] API specification (OpenAPI)
- **Milestone:** Architecture approved, environment ready

### Week 3-5: Backend Core & Log Pipeline

- [ ] Log ingestion service (REST API)
- [ ] Redis queue integration
- [ ] Log parsing and normalization
- [ ] Elasticsearch integration
- [ ] Basic correlation rules
- [ ] API Gateway (Nginx)
- **Milestone:** Logs ingested, normalized, stored

### Week 6-8: AI Integration

- [ ] Feature extraction pipeline
- [ ] Model training on datasets
- [ ] Model serving integration
- [ ] Real-time inference
- [ ] Alert generation logic
- [ ] Performance monitoring
- **Milestone:** AI detecting anomalies

### Week 9-10: Frontend & Dashboard

- [ ] Dashboard UI (React)
- [ ] Real-time alert display
- [ ] Incident management
- [ ] Log search
- [ ] User authentication
- [ ] Basic reporting
- **Milestone:** Functional dashboard

### Week 11: Integration & Testing

- [ ] End-to-end testing
- [ ] Load testing (1000 EPS)
- [ ] Security testing
- [ ] UAT with internal users
- [ ] Bug fixes
- **Milestone:** MVP passes tests

### Week 12: Deployment & Documentation

- [ ] Production environment
- [ ] Deployment automation
- [ ] User documentation
- [ ] API documentation
- [ ] Runbook
- [ ] Pilot materials
- **Milestone:** MVP deployed

---

## 7. Team Structure & Role Definitions

| Role | Responsibilities | Skills | Time |
|------|-----------------|--------|------|
| **Founder/Product Lead** | Vision, architecture, investors, pilots | SOC domain, leadership | Full-time |
| **Backend Engineer** | Log pipeline, APIs, correlation | Python, FastAPI, Redis | Full-time |
| **AI/ML Engineer** | Models, training, inference | Scikit-learn, PyTorch | Full-time |
| **Frontend Developer** | Dashboard, UX, real-time | React, WebSocket | Full-time |
| **DevOps Engineer** | Infra, deployment, security | Docker, AWS, security | 0.5 FTE |

**Optional Contractors:**
- UX Designer (dashboard mockups)
- Security Auditor (pre-launch)
- Technical Writer (documentation)

---

## 8. Budget Estimation & Resource Planning

### One-Time Costs

| Item | Cost (INR) |
|------|-----------|
| Development tools | ₹50,000 |
| Cloud credits (startup program) | ₹0 |
| Legal/incorporation | ₹30,000 |
| **Total** | **₹80,000** |

### Monthly Recurring Costs

| Category | Cost (INR/month) |
|----------|-----------------|
| **Infrastructure** | |
| Cloud hosting | ₹20,000 |
| Database services | ₹15,000 |
| Storage | ₹5,000 |
| **Team** | |
| Founder (minimal) | ₹50,000 |
| Backend Engineer | ₹80,000 |
| AI/ML Engineer | ₹90,000 |
| Frontend Developer | ₹70,000 |
| DevOps (0.5 FTE) | ₹40,000 |
| **Tools** | |
| Monitoring | ₹5,000 |
| CI/CD | ₹2,000 |
| Communication | ₹2,000 |
| **Misc** | |
| Contingency (10%) | ₹40,000 |
| **Total Monthly** | **₹419,000** |

**3-Month MVP Budget:** ~₹13.4 lakhs  
**4-Month MVP Budget:** ~₹17.6 lakhs

---

## 9. Pilot Deployment Strategy

### Customer Selection Criteria

- 3-5 companies in target segment
- Minimum 50 endpoints
- Willing to provide feedback
- Potential for case study

### Onboarding Process

**Week 1: Pre-Deployment**
- Discovery call
- Technical assessment
- SOW/NDA signing

**Week 2-3: Deployment**
- Agent installation
- Log source configuration
- Platform setup
- Testing

**Week 4-8: Monitoring**
- Daily health checks
- Weekly reviews
- Support

**Week 9-12: Feedback**
- Surveys
- Iteration
- Case study development

---

## 10. Success Metrics & KPIs

### Technical Metrics

| Metric | Target |
|--------|--------|
| Detection Latency | < 5 seconds (p95) |
| Throughput | 1,000 EPS |
| Precision | > 85% |
| False Positive Rate | < 15% |
| Uptime | 99% |
| Dashboard Load Time | < 3 seconds |

### Business Metrics

| Metric | Target |
|--------|--------|
| Pilot Customers | 3-5 |
| Onboarding Time | < 5 days |
| NPS | > 40 |
| Pilot-to-Paid | > 50% |

---

## 11. Investor Readiness Checklist

**Product Demo:**
- [ ] Live 15-min demo
- [ ] 5-min video demo
- [ ] Sandbox environment

**Documentation:**
- [ ] API docs
- [ ] Technical whitepaper
- [ ] Security overview

**Traction:**
- [ ] 3+ pilot deployments
- [ ] LOIs
- [ ] Testimonials

**Materials:**
- [ ] Pitch deck
- [ ] Financial model
- [ ] One-pager

---

## 12. Risk Analysis & Mitigation

### Technical Risks

| Risk | Mitigation |
|------|------------|
| AI accuracy below target | Ensemble models, rule-based fallback |
| Pipeline failures | Redundant queues, circuit breakers |
| Performance bottlenecks | Indexing, partitioning, caching |

### Security Risks

| Risk | Mitigation |
|------|------------|
| Platform breach | Regular audits, pen testing |
| Data leakage | Encryption, access controls |

### Business Risks

| Risk | Mitigation |
|------|------------|
| Low adoption | Free pilots, white-glove onboarding |
| Competition | Focus on SMB niche, Indian market |
| Funding difficulty | Revenue from pilots, accelerators |

---

## Next Steps

1. **Immediate:** Complete backend services (Week 3-5)
2. **Short-term:** AI integration and dashboard (Week 6-10)
3. **Pre-launch:** Testing and pilot preparation (Week 11-12)
4. **Launch:** First pilot deployment

---

*This document serves as the master plan for SecuRock SOC MVP development. Update regularly as implementation progresses.*
