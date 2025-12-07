#!/usr/bin/env python
"""Test API with authentication"""
import requests
import json

BASE_URL = "http://127.0.0.1:5000"

# Step 1: Register a user (if needed)
print("Step 1: Registering/Creating user...")
auth_url = f"{BASE_URL}/api/auth/register"
auth_data = {
    "username": "testuser123",
    "password": "testpass123",
    "email": "test@example.com"
}

try:
    response = requests.post(auth_url, json=auth_data, timeout=5)
    print(f"Register status: {response.status_code}")
    if response.status_code != 201:
        print(f"Register response: {response.text[:200]}")
except Exception as e:
    print(f"Register error: {e}")

# Step 2: Login and get token
print("\nStep 2: Logging in to get JWT token...")
login_url = f"{BASE_URL}/api/auth/login"
login_data = {
    "username": "testuser123",
    "password": "testpass123"
}

try:
    response = requests.post(login_url, json=login_data, timeout=5)
    print(f"Login status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        token = result.get('access_token')
        print(f"✓ Got token: {token[:20]}...")
    else:
        print(f"Login failed: {response.text[:200]}")
        exit(1)
except Exception as e:
    print(f"Login error: {e}")
    exit(1)

# Step 3: Create a chat
print("\nStep 3: Creating a new chat...")
chat_url = f"{BASE_URL}/api/chats"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}
chat_data = {"title": "Test Chat"}

try:
    response = requests.post(chat_url, headers=headers, json=chat_data, timeout=5)
    print(f"Chat creation status: {response.status_code}")
    if response.status_code == 201:
        result = response.json()
        chat_id = result.get('id')
        print(f"✓ Chat created with ID: {chat_id}")
    else:
        print(f"Chat creation failed: {response.text[:200]}")
        exit(1)
except Exception as e:
    print(f"Chat creation error: {e}")
    exit(1)

# Step 4: Send a message
print("\nStep 4: Sending test message to AI...")
message_url = f"{BASE_URL}/api/messages/{chat_id}/send"
message_data = {
    "text": "What is React?"
}

try:
    response = requests.post(message_url, headers=headers, json=message_data, timeout=30)
    print(f"Message status: {response.status_code}")
    if response.status_code == 201:
        result = response.json()
        ai_message = result.get('ai_message', {})
        ai_text = ai_message.get('text', '')
        print(f"✓ AI Response received!")
        print(f"\nAI Response (first 300 chars):")
        print(ai_text[:300])
        print(f"\n... (total {len(ai_text)} characters)")
        
        if "That's an interesting question!" in ai_text:
            print("\n⚠️  WARNING: Got fallback response, not Gemini!")
        else:
            print("\n✓✓✓ Got proper Gemini response!")
    else:
        print(f"Message send failed: {response.text[:500]}")
except Exception as e:
    print(f"Message send error: {e}")
    import traceback
    traceback.print_exc()
