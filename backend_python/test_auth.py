#!/usr/bin/env python
"""Quick registration test script"""
import requests
import json

BASE_URL = "http://localhost:5000"

def test_registration():
    """Test the registration endpoint"""
    url = f"{BASE_URL}/api/auth/register"
    data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "TestPassword123"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    print(f"Testing registration at {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data, headers=headers)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 201:
            print("\n✅ Registration successful!")
            return True
        else:
            print(f"\n❌ Registration failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        return False

def test_login():
    """Test the login endpoint"""
    url = f"{BASE_URL}/api/auth/login"
    data = {
        "username": "testuser",
        "password": "TestPassword123"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    print(f"\n\nTesting login at {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data, headers=headers)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("\n✅ Login successful!")
            return True
        else:
            print(f"\n❌ Login failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("API Registration & Login Test")
    print("=" * 60)
    
    # Test registration
    if test_registration():
        # Test login
        test_login()
    
    print("\n" + "=" * 60)
    print("Test complete!")
    print("=" * 60)
