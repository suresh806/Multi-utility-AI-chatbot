#!/usr/bin/env python
"""Quick test to debug Gemini API response"""
import requests
import json

# Test the API
url = "http://localhost:5000/api/messages/1/send"
headers = {"Content-Type": "application/json"}
data = {
    "text": "What is Python?"
}

print("Sending request to:", url)
print("Data:", json.dumps(data, indent=2))
print("\nWaiting for response...\n")

try:
    response = requests.post(url, headers=headers, json=data, timeout=10)
    print("Status Code:", response.status_code)
    print("Response:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
