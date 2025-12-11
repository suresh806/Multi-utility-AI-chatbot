import requests
import random

test_data = {
    'username': f'user{random.randint(1000000, 9999999)}',
    'email': f'test{random.randint(100000,999999)}@test.com',
    'password': 'testpass123'
}

print("Testing Registration...")
try:
    r = requests.post('http://localhost:3000/api/auth/register', json=test_data, timeout=5)
    print(f"Status: {r.status_code}")
    
    if r.status_code == 201:
        user = r.json()['user']
        print(f"✅ Registration successful!")
        print(f"   Username: {user['username']}")
        print(f"   Email: {user['email']}")
        
        # Test login
        print("\nTesting Login...")
        login_data = {
            'username': test_data['username'],
            'password': test_data['password']
        }
        lr = requests.post('http://localhost:3000/api/auth/login', json=login_data, timeout=5)
        print(f"Status: {lr.status_code}")
        
        if lr.status_code == 200:
            print(f"✅ Login successful!")
            token = lr.json()['token']
            print(f"   Token: {token[:30]}...")
        else:
            print(f"❌ Login failed: {lr.json()}")
    else:
        print(f"❌ Registration failed: {r.json()}")
        
except Exception as e:
    print(f"❌ Error: {str(e)}")
