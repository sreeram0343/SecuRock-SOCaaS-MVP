import pytest
from unittest.mock import MagicMock
from app.services.ml_service import ml_service

@pytest.fixture(autouse=True)
def force_heuristic_mode():
    # Force heuristic/fallback mode by removing the ML model
    original_model = ml_service.model
    ml_service.model = None
    yield
    ml_service.model = original_model

def test_ml_service_explain_anomaly_normal():
    # Features: [packet_size, duration, request_rate]
    # Baselines are:
    # packet_size: mean 350.0, std 120.0
    # duration: mean 4.5, std 2.5
    # request_rate: mean 12.0, std 6.0
    
    # Test a perfectly normal set of features
    result = ml_service.explain_anomaly([350.0, 4.5, 12.0])
    
    assert result["risk_score"] < 0.6
    assert result["confidence"] == 0.90
    assert "normal" in result["reasoning"].lower()
    assert len(result["mitre_mapping"]) == 0

def test_ml_service_explain_anomaly_packet_size_deviation():
    # Egress payload anomaly (high packet size)
    result = ml_service.explain_anomaly([1500.0, 4.5, 12.0])
    
    assert result["risk_score"] > 0.6
    assert result["primary_feature"] == "packet_size"
    assert "packet_size" in result["reasoning"]
    assert len(result["mitre_mapping"]) == 1
    assert result["mitre_mapping"][0]["id"] == "T1048.002"
    assert "Exfiltration" in result["mitre_mapping"][0]["name"]

def test_ml_service_explain_anomaly_duration_deviation():
    # Persistent duration anomaly
    result = ml_service.explain_anomaly([350.0, 5000.0, 12.0])
    
    assert result["risk_score"] > 0.6
    assert result["primary_feature"] == "duration"
    assert "duration" in result["reasoning"]
    assert len(result["mitre_mapping"]) == 1
    assert result["mitre_mapping"][0]["id"] == "T1071.001"
    assert "Web Protocols" in result["mitre_mapping"][0]["name"]

def test_ml_service_explain_anomaly_rate_deviation():
    # Request rate anomaly
    result = ml_service.explain_anomaly([350.0, 4.5, 200.0])
    
    assert result["risk_score"] > 0.6
    assert result["primary_feature"] == "request_rate"
    assert "request_rate" in result["reasoning"]
    assert len(result["mitre_mapping"]) == 1
    assert result["mitre_mapping"][0]["id"] == "T1110"
    assert "Brute Force" in result["mitre_mapping"][0]["name"]

def test_ml_service_invalid_features():
    # Empty features
    result = ml_service.explain_anomaly([])
    assert result["risk_score"] == 0.0
    assert result["confidence"] == 0.0
    
    # Incorrect dimension
    result = ml_service.explain_anomaly([350.0, 4.5])
    assert result["risk_score"] == 0.0
    assert result["confidence"] == 0.0

def test_ml_service_with_mock_model():
    # Verify the code path when a model is active
    mock_model = MagicMock()
    # Mock decision function to return an anomaly (value < 0)
    mock_model.decision_function.return_value = [-0.2]
    
    ml_service.model = mock_model
    # Import ML_AVAILABLE check or mock it
    from app.services.ml_service import ML_AVAILABLE
    
    if ML_AVAILABLE:
        # High request rate to trigger anomaly check
        result = ml_service.explain_anomaly([350.0, 4.5, 200.0])
        assert result["risk_score"] > 0.6
        mock_model.decision_function.assert_called_once_with([[350.0, 4.5, 200.0]])
