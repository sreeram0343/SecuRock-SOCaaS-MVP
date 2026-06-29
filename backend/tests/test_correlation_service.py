import pytest
from unittest.mock import AsyncMock, patch
from app.services.correlation_service import correlation_service
from app.models.alert import Alert
from sqlalchemy.future import select

@pytest.mark.asyncio
@patch("app.services.redis_service.redis_service.publish", new_callable=AsyncMock)
@patch("app.services.redis_service.redis_service.connect", new_callable=AsyncMock)
async def test_correlation_suspicious_activity(mock_connect, mock_publish, db_session):
    # Log indicating a suspicious activity
    log = {
        "event_type": "SUSPICIOUS_FILE_EXECUTION",
        "severity": "HIGH",
        "source_ip": "192.168.1.50",
        "destination_ip": "10.0.0.1",
        "user": "sreeram"
    }
    
    await correlation_service.analyze_log(log, db_session)
    
    # Verify Alert is inserted in the DB
    result = await db_session.execute(select(Alert).where(Alert.event_type == "SUSPICIOUS_FILE_EXECUTION"))
    alert = result.scalars().first()
    
    assert alert is not None
    assert alert.severity == "HIGH"
    assert "Suspicious Activity Detected" in alert.title
    assert alert.source_ip == "192.168.1.50"
    
    # Verify Redis publish was called
    mock_publish.assert_called_once()
    args, kwargs = mock_publish.call_args
    assert args[0] == "alerts"
    assert "id" in args[1]
    assert "Suspicious Activity" in args[1]

@pytest.mark.asyncio
@patch("app.services.redis_service.redis_service.publish", new_callable=AsyncMock)
@patch("app.services.redis_service.redis_service.connect", new_callable=AsyncMock)
async def test_correlation_failed_login(mock_connect, mock_publish, db_session):
    # Log indicating a failed login
    log = {
        "event_type": "FAILED_LOGIN",
        "severity": "MEDIUM",
        "source_ip": "192.168.1.60",
        "user": "admin"
    }
    
    await correlation_service.analyze_log(log, db_session)
    
    # Verify Alert is inserted in the DB
    result = await db_session.execute(select(Alert).where(Alert.event_type == "FAILED_LOGIN"))
    alert = result.scalars().first()
    
    assert alert is not None
    assert alert.severity == "MEDIUM"
    assert "Failed Login Attempt" in alert.title
    assert "admin" in alert.description
    
    # Verify Redis publish was called
    mock_publish.assert_called_once()

@pytest.mark.asyncio
@patch("app.services.redis_service.redis_service.publish", new_callable=AsyncMock)
@patch("app.services.redis_service.redis_service.connect", new_callable=AsyncMock)
async def test_correlation_no_alert_for_info_logs(mock_connect, mock_publish, db_session):
    # Normal activity log
    log = {
        "event_type": "USER_LOGIN_SUCCESS",
        "severity": "INFO",
        "source_ip": "192.168.1.70",
        "user": "user"
    }
    
    await correlation_service.analyze_log(log, db_session)
    
    # Verify no alert is created in the DB
    result = await db_session.execute(select(Alert))
    alerts = result.scalars().all()
    
    assert len(alerts) == 0
    mock_publish.assert_not_called()
