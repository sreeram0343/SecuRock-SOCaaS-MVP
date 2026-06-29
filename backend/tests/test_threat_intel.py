import pytest
from app.services.threat_intel import threat_intel

@pytest.mark.asyncio
async def test_threat_intel_local_blocklist_ips():
    # Test checking known blocklisted IPs
    res1 = await threat_intel.check_ip("192.168.1.100")
    assert res1["is_malicious"] is True
    assert res1["risk_score"] == 100
    assert "Malicious Actor" in res1["threat_type"]
    assert res1["source"] == "Local Blocklist"

    res2 = await threat_intel.check_ip("10.0.0.99")
    assert res2["is_malicious"] is True
    assert res2["risk_score"] == 100
    assert "Botnet C2" in res2["threat_type"]

@pytest.mark.asyncio
async def test_threat_intel_feed_fallback_ips():
    # Test endswith .66 rule for threat feeds
    res = await threat_intel.check_ip("192.168.1.66")
    assert res["is_malicious"] is True
    assert res["risk_score"] == 85
    assert res["source"] == "Threat Feed"

@pytest.mark.asyncio
async def test_threat_intel_clean_ips():
    # Test clean IP
    res = await threat_intel.check_ip("8.8.8.8")
    assert res["is_malicious"] is False
    assert res["risk_score"] == 0
    assert res["threat_type"] is None
