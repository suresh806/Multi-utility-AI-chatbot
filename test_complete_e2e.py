import requests
import json
import random

print("=" * 70)
print("COMPLETE END-TO-END TEST")
print("=" * 70)
print()

username = f'e2etest{random.randint(100000, 999999)}'
email = f'{username}@test.com'
password = 'TestPass@123'

test_data = {
    'username': username,
    'email': email,
    'password': password
}

base_url = 'http://localhost:3000'

try:
    # 1. Registration Test
    print("1️⃣  REGISTRATION TEST")
    print(f"   Username: {username}")
    print(f"   Email: {email}")
    
    reg = requests.post(f'{base_url}/api/auth/register', json=test_data, timeout=5)
    assert reg.status_code == 201, f"Expected 201, got {reg.status_code}"
    user = reg.json()['user']
    print(f"   ✅ Status: {reg.status_code}")
    print(f"   ✅ User ID: {user['id']}")
    print()
    
    # 2. Login Test
    print("2️⃣  LOGIN TEST")
    login_data = {'username': username, 'password': password}
    login = requests.post(f'{base_url}/api/auth/login', json=login_data, timeout=5)
    assert login.status_code == 200, f"Expected 200, got {login.status_code}"
    token = login.json()['token']
    print(f"   ✅ Status: {login.status_code}")
    print(f"   ✅ Token: {token[:30]}...")
    print()
    
    # 3. Chat Test
    print("3️⃣  CHAT TEST")
    headers = {'Authorization': f'Bearer {token}'}
    chat_data = {'message': 'What is Python programming?'}
    
    chat = requests.post(f'{base_url}/api/chat', json=chat_data, headers=headers, timeout=30)
    assert chat.status_code == 200, f"Expected 200, got {chat.status_code}"
    reply = chat.json().get('reply', chat.json().get('response', ''))
    print(f"   ✅ Status: {chat.status_code}")
    print(f"   ✅ Message sent: 'What is Python programming?'")
    print()
    print("   AI Response (first 150 chars):")
    print(f"   {reply[:150]}...")
    print()
    
    print("=" * 70)
    print("✅ ALL TESTS PASSED - FULL SYSTEM WORKING!")
    print("=" * 70)
    
except AssertionError as e:
    print(f"   ❌ Test failed: {e}")
except Exception as e:
    print(f"   ❌ Error: {str(e)[:150]}")
