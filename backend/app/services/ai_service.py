from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from app.config import settings
from typing import List, Optional

class RiskAssessment(BaseModel):
    risk_score: float = Field(description="A score between 0.0 and 1.0 indicating security risk")
    narrative: str = Field(description="A human-readable explanation of the security event")
    remediation_steps: List[str] = Field(description="List of actionable steps to mitigate the threat")

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
                risk_score=0.1, 
                narrative="AI Analysis unavailable. Review raw logs.",
                remediation_steps=["Check firewall logs", "Monitor user activity"]
            )

ai_service = AIService()
