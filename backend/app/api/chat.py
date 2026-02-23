from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user, get_db
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context_incident_id: str = None

@router.post("/")
async def chat_with_assistant(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Interact with the SOC AI Assistant."""
    # Placeholder for the actual LangChain/Assistant integration
    return {
        "reply": f"Received your message: {request.message}. I am the AI assistant analyzing incident {request.context_incident_id or 'general'}."
    }
