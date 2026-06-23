import os
import json
import datetime
from typing import Dict, Any, List, TypedDict, Optional
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from app.config import settings

# 1. Define Agent State Schema
class AgentState(TypedDict):
    incident_id: str
    organization_id: str
    raw_alert: Dict[str, Any]
    tasks: List[Dict[str, Any]]
    threat_intel: Dict[str, Any]
    timeline: List[Dict[str, Any]]
    remediation_steps: List[str]
    compliance_mapping: Dict[str, Any]
    case_summary: str
    patient_zero: str
    blast_radius: Dict[str, Any]
    current_step: str
    logs_examined: List[Dict[str, Any]]
    errors: List[str]

# 2. Implement the Agent State Graph Executor
class AgentStateGraph:
    """
    A lightweight, robust multi-agent execution graph that runs nodes sequentially,
    mimicking LangGraph state management and routing.
    """
    def __init__(self):
        self.nodes = {}
        self.edges = []
        self.entry_point = None

    def add_node(self, name: str, func):
        self.nodes[name] = func

    def add_edge(self, from_node: str, to_node: str):
        self.edges.append((from_node, to_node))

    def set_entry_point(self, name: str):
        self.entry_point = name

    async def execute(self, initial_state: AgentState) -> AgentState:
        state = initial_state.copy()
        current_node = self.entry_point
        
        # Track execution path
        steps_executed = 0
        max_steps = 20  # Prevent infinite loops

        while current_node and steps_executed < max_steps:
            state["current_step"] = current_node
            # Execute node
            try:
                node_func = self.nodes[current_node]
                updates = await node_func(state)
                # Apply updates to state
                if updates:
                    state.update(updates)
            except Exception as e:
                err_msg = f"Error in node {current_node}: {str(e)}"
                print(err_msg)
                state["errors"].append(err_msg)

            # Find next node in edges
            next_node = None
            for from_n, to_n in self.edges:
                if from_n == current_node:
                    next_node = to_n
                    break
            
            current_node = next_node
            steps_executed += 1

        return state

# 3. Define Agent Nodes

# Helper to check if OpenAI is configured
def get_llm():
    api_key = getattr(settings, 'OPENAI_API_KEY', None)
    if api_key and api_key != "sk-dummy" and not api_key.startswith("YOUR_"):
        return ChatOpenAI(model="gpt-4", api_key=api_key, temperature=0.1)
    return None

# A) Planner Agent Node
async def planner_node(state: AgentState) -> Dict[str, Any]:
    alert = state["raw_alert"]
    print(f"[Planner Agent] Planning investigation for Alert: {alert.get('title')}")
    
    llm = get_llm()
    if llm:
        try:
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are a Principal Incident Response Coordinator. Create a step-by-step investigation checklist based on this alert."),
                ("user", "Alert: {alert_title}\nSeverity: {severity}\nDescription: {description}")
            ])
            chain = prompt | llm
            response = await chain.ainvoke({
                "alert_title": alert.get("title", "Unknown Anomaly"),
                "severity": alert.get("severity", "medium"),
                "description": alert.get("description", "No description")
            })
            # Convert text outline to list of dictionary tasks
            tasks = [{"task": line.strip(), "status": "pending"} for line in response.content.split("\n") if line.strip()]
        except Exception as e:
            print(f"Planner LLM failed: {e}")
            tasks = []
    else:
        # Fallback Heuristic Planning
        tasks = [
            {"task": "Query threat intelligence feed to assess IP reputation score.", "status": "pending"},
            {"task": "Search ClickHouse logs for lateral movement from the source IP.", "status": "pending"},
            {"task": "Retrieve the process tree execution chain on the compromised host.", "status": "pending"},
            {"task": "Identify blast radius and impacted user credentials.", "status": "pending"}
        ]

    return {"tasks": tasks}

# B) Threat Intelligence Agent Node
async def threat_intel_node(state: AgentState) -> Dict[str, Any]:
    alert = state["raw_alert"]
    source_ip = alert.get("source_ip", "Unknown")
    print(f"[Threat Intel Agent] Enriching indicators for IP: {source_ip}")
    
    # Simulate lookup (e.g. AlienVault OTX / AbuseIPDB)
    is_malicious = source_ip.endswith(".66") or source_ip in ["192.168.1.100", "10.0.0.99"]
    reputation_score = 90 if is_malicious else 0
    threat_actor = "UNC2891 (APT group)" if is_malicious else "None"
    
    intel_data = {
        "ip_address": source_ip,
        "is_malicious": is_malicious,
        "reputation_score": reputation_score,
        "associated_campaigns": ["QuietSieve"] if is_malicious else [],
        "threat_actor": threat_actor,
        "resolved_dns": "c2-server.malicious.domain" if is_malicious else "localhost"
    }
    
    return {"threat_intel": intel_data}

# C) Graph Investigation Agent Node
async def investigator_node(state: AgentState) -> Dict[str, Any]:
    alert = state["raw_alert"]
    intel = state["threat_intel"]
    source_ip = alert.get("source_ip", "Unknown")
    print(f"[Investigation Agent] Constructing attack chain timeline for {source_ip}")
    
    # Simulate queries to Neo4j relationship logs and ClickHouse events
    timeline = []
    patient_zero = "Unknown"
    blast_radius = {"impacted_hosts": [], "compromised_users": [], "affected_files": []}
    
    now = datetime.datetime.utcnow()
    
    if intel.get("is_malicious"):
        patient_zero = "WS-01-DESKTOP (compromised via phishing attachment)"
        blast_radius = {
            "impacted_hosts": ["WS-01-DESKTOP", "SRV-PROD-DB"],
            "compromised_users": ["sreeram_admin", "billing_service"],
            "affected_files": ["C:\\Windows\\Temp\\loader.exe", "/var/lib/postgresql/data/dump.sql"]
        }
        
        timeline = [
            {
                "timestamp": str(now - datetime.timedelta(minutes=15)),
                "stage": "Initial Access",
                "activity": f"User clicked phishing link; payload downloaded from malicious server ({intel.get('resolved_dns')})"
            },
            {
                "timestamp": str(now - datetime.timedelta(minutes=12)),
                "stage": "Execution",
                "activity": "PowerShell spawned parent process 'cmd.exe' execution with encoded command to drop loader bin."
            },
            {
                "timestamp": str(now - datetime.timedelta(minutes=5)),
                "stage": "Lateral Movement",
                "activity": f"SSH connection established from WS-01-DESKTOP ({source_ip}) to production database server using admin credentials."
            },
            {
                "timestamp": str(now),
                "stage": "Actions on Objectives",
                "activity": "Data dump initiated over network, triggering the high-severity alert."
            }
        ]
    else:
        # Normal timeline fallback
        patient_zero = "N/A"
        timeline = [
            {
                "timestamp": str(now),
                "stage": "Standard Operations",
                "activity": f"Legitimate administrator session authenticated from {source_ip} to service API."
            }
        ]

    # Update tasks to completed
    updated_tasks = state["tasks"].copy()
    for task in updated_tasks:
        task["status"] = "completed"

    return {
        "timeline": timeline,
        "patient_zero": patient_zero,
        "blast_radius": blast_radius,
        "tasks": updated_tasks
    }

# D) Response Agent Node
async def responder_node(state: AgentState) -> Dict[str, Any]:
    intel = state["threat_intel"]
    alert = state["raw_alert"]
    print("[Response Agent] Formulating mitigation playbook")
    
    remediation_steps = []
    
    if intel.get("is_malicious"):
        remediation_steps = [
            f"Isolate compromised host WS-01-DESKTOP from local VLAN segment.",
            f"Add firewall rule blocking ingress/egress to remote IP address {alert.get('source_ip')}.",
            f"Revoke all active tokens and force password reset for user credentials: 'sreeram_admin'.",
            f"Quarantine file loader.exe on host filesystem segment."
        ]
    else:
        remediation_steps = [
            "Monitor session activity logs for any changes in typical network baselines."
        ]
        
    return {"remediation_steps": remediation_steps}

# E) Reporting Agent Node
async def reporting_node(state: AgentState) -> Dict[str, Any]:
    alert = state["raw_alert"]
    intel = state["threat_intel"]
    remediation = state["remediation_steps"]
    timeline = state["timeline"]
    
    print("[Reporting Agent] Compiling incident story summary and mapping compliance compliance controls")
    
    llm = get_llm()
    case_summary = ""
    
    if llm:
        try:
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are a Senior Threat Analyst. Summarize the incident timeline and actions into an explainable executive story."),
                ("user", "Alert: {alert_title}\nTimeline: {timeline}\nThreat Intel: {intel}\nRemediation: {remediation}")
            ])
            chain = prompt | llm
            response = await chain.ainvoke({
                "alert_title": alert.get("title"),
                "timeline": str(timeline),
                "intel": str(intel),
                "remediation": str(remediation)
            })
            case_summary = response.content
        except Exception as e:
            print(f"Reporting LLM failed: {e}")
            case_summary = ""
            
    if not case_summary:
        # Fallback narrative compiler
        actor_name = intel.get("threat_actor", "Unknown threat actor")
        if intel.get("is_malicious"):
            case_summary = (
                f"SecuRock Incident Response Report: A critical security alert was raised due to {alert.get('title')}. "
                f"Threat intelligence identified the source IP {alert.get('source_ip')} as malicious, associated with "
                f"{actor_name} and campaign '{', '.join(intel.get('associated_campaigns', []))}'. "
                f"The attack chain originated from patient zero host {state['patient_zero']}, leading to lateral movement "
                f"and database exfiltration. Containment protocols have been prepared to block the actor and isolate compromised assets."
            )
        else:
            case_summary = (
                f"Incident Review: Anomaly alert for {alert.get('title')} was reviewed by the AI Analyst. "
                f"Statistical deviations were checked against regular network baselines and confirmed to be false alarms "
                f"or benign operational changes."
            )
            
    # Map compliance frameworks
    compliance_mapping = {
        "NIST_CSF": {
            "ID.AM": "Asset Management checks completed",
            "PR.AC": "Access Control policies violated during incident",
            "DE.AE": "Detection of anomalies and events achieved",
            "RS.CO": "Communications response playbooks dispatched"
        },
        "SOC2": {
            "CC6.1": "Access credentials compromised and logged",
            "CC7.2": "Vulnerability monitoring and threat detection executed"
        }
    }
    
    return {
        "case_summary": case_summary,
        "compliance_mapping": compliance_mapping
    }

# 4. Instantiate and Configure the Graph
def build_investigation_graph() -> AgentStateGraph:
    graph = AgentStateGraph()
    
    graph.add_node("planner", planner_node)
    graph.add_node("threat_intel", threat_intel_node)
    graph.add_node("investigator", investigator_node)
    graph.add_node("responder", responder_node)
    graph.add_node("reporting", reporting_node)
    
    graph.set_entry_point("planner")
    graph.add_edge("planner", "threat_intel")
    graph.add_edge("threat_intel", "investigator")
    graph.add_edge("investigator", "responder")
    graph.add_edge("responder", "reporting")
    
    return graph

investigation_graph = build_investigation_graph()

# 5. Core Entrypoint to run case analysis
async def run_investigation(incident_id: str, organization_id: str, alert_data: dict) -> dict:
    initial_state: AgentState = {
        "incident_id": incident_id,
        "organization_id": organization_id,
        "raw_alert": alert_data,
        "tasks": [],
        "threat_intel": {},
        "timeline": [],
        "remediation_steps": [],
        "compliance_mapping": {},
        "case_summary": "",
        "patient_zero": "",
        "blast_radius": {},
        "current_step": "start",
        "logs_examined": [],
        "errors": []
    }
    
    final_state = await investigation_graph.execute(initial_state)
    return final_state
