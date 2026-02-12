import requests

API_URL = "http://localhost:8000/register"
DATA = {
    "email": "test@test.com",
    "password": "password123",
    "full_name": "Test User",
    "organization_name": "TestOrg"
}

try:
    resp = requests.post(API_URL, json=DATA)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")
except Exception as e:
    print(f"Error: {e}")
