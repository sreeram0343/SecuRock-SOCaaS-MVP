from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from app.config import settings
from typing import List, Optional

class RiskAssessment(BaseModel):
    executive_summary: str = Field(description="High-level overview suitable for C-suite")
    technical_analysis: str = Field(description="Detailed technical breakdown of the event")
    timeline_of_events: List[str] = Field(description="Chronological sequence of actions")
    risk_justification: str = Field(description="Explanation of why this risk score was assigned")
    recommended_remediation: List[str] = Field(description="Actionable steps to mitigate the threat")
    business_impact: str = Field(description="Potential impact on the business if unmitigated")
    risk_score: float = Field(description="A score between 0.0 and 1.0 indicating security risk")

class AIService:
    def __init__(self):
        # Initialize with dummy API key if not present (will fail at runtime if needed, but safe for startup)
        api_key = settings.OPENAI_API_KEY if hasattr(settings, 'OPENAI_API_KEY') and settings.OPENAI_API_KEY else "sk-dummy"
        self.llm = ChatOpenAI(model="gpt-4", api_key=api_key)
        self.parser = PydanticOutputParser(pydantic_object=RiskAssessment)
    
    async def analyze_log(self, log_data: dict) -> RiskAssessment:
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a Tier 3 SOC Analyst. Analyze the following security log and provide a risk assessment."),
            ("user", "{log_entry}\n\n{format_instructions}")
        ])
        
        chain = prompt | self.llm | self.parser
        
        try:
            result = await chain.ainvoke({
                "log_entry": str(log_data),
                "format_instructions": self.parser.get_format_instructions()
            })
            return result
        except Exception as e:
            print(f"AI Analysis failed: {e}")
            # Fallback
            return RiskAssessment(
                executive_summary="AI Analysis unavailable due to service error.",
                technical_analysis="Raw logs must be reviewed manually.",
                timeline_of_events=["T0: Event detected", "T1: AI Analysis failed"],
                risk_justification="Defaulting to baseline risk due to analysis failure.",
                recommended_remediation=["Check firewall logs", "Monitor user activity"],
                business_impact="Unknown until manual review is completed.",
                risk_score=0.1
            )

ai_service = AIService()
