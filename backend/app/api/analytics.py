
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.analytics import AnalyticsDashboard

router = APIRouter()

@router.get("/dashboard", response_model=AnalyticsDashboard)
async def get_dashboard_metrics(current_user: User = Depends(get_current_user)):
    # Mock data for MVP
    return {
        "total_alerts": 120,
        "total_incidents": 5,
        "open_incidents": 2,
        "mean_time_to_response": 45.5,
        "alerts_over_time": [
            {"timestamp": "2024-01-01", "value": 10},
            {"timestamp": "2024-01-02", "value": 15},
            {"timestamp": "2024-01-03", "value": 8}
        ],
        "severity_distribution": [
            {"severity": "critical", "count": 5},
            {"severity": "high", "count": 15},
            {"severity": "medium", "count": 40},
            {"severity": "low", "count": 60}
        ],
        "recent_attacks": [
            {"source": [-74.006, 40.7128], "destination": [2.3522, 48.8566], "value": 1}, # NYC to Paris
            {"source": [37.6173, 55.7558], "destination": [-0.1278, 51.5074], "value": 1}, # Moscow to London
            {"source": [139.6917, 35.6895], "destination": [-122.4194, 37.7749], "value": 1}, # Tokyo to SF
            {"source": [-43.1729, -22.9068], "destination": [151.2093, -33.8688], "value": 1}, # Rio to Sydney
             {"source": [77.2090, 28.6139], "destination": [-74.006, 40.7128], "value": 1}, # Delhi to NYC
        ]
    }
