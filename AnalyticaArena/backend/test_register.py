import requests
import json

url = "http://localhost:8000/api/auth/register"
payload = {
    "full_name": "Test User",
    "email": "test_new@example.com",
    "password": "password123"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
