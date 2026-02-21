import openai
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class NarrativeLLM:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        if self.api_key:
            openai.api_key = self.api_key
            
    def generate_narrative(self, host: str, incidents: list, risk_score: float, severity: str):
        if not self.api_key:
            return {
                "executive_summary": "LLM API Key not configured.",
                "timeline": ["Start", "Detection", "Alert"],
                "risk_justification": f"Risk Score {risk_score} based on generic heuristic.",
                "recommended_action": "Configure OpenAI API key to get detailed narratives."
            }

        prompt = f"""
        You are an expert AI SOC Analyst. Provide a structured incident narrative for the following details.
        
        Host: {host}
        Risk Score: {risk_score}
        Severity: {severity}
        Incidents: {incidents}

        Provide the output in exactly this JSON format:
        {{
            "executive_summary": "...",
            "timeline": ["event 1", "event 2"],
            "risk_justification": "...",
            "recommended_action": "..."
        }}
        """
        try:
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": prompt}],
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            import json
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            logger.error(f"Failed to generate narrative: {e}")
            return {
                "executive_summary": "Error generating narrative.",
                "timeline": [],
                "risk_justification": "Unknown due to error.",
                "recommended_action": "Check LLM service logs."
            }

narrative_llm = NarrativeLLM()
