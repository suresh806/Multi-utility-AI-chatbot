#!/usr/bin/env python3
"""
Test the image endpoint with a sample image
"""
import requests
import base64
import os
from pathlib import Path

# Try to create a simple test image or use an existing one
def create_test_image():
    """Create a simple test PNG image"""
    # This is a minimal valid PNG (1x1 pixel, red)
    png_data = (
        b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01'
        b'\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00'
        b'\x00\x01\x01\x00\x05\x18\r\xb5\x00\x00\x00\x00IEND\xaeB`\x82'
    )
    return png_data

def test_image_endpoint():
    """Test the /api/chat/image endpoint"""
    BASE_URL = 'http://localhost:5000'
    
    # First, login to get a token
    print("1. Testing login...")
    login_response = requests.post(
        f'{BASE_URL}/api/auth/login',
        json={'username': 'test', 'password': 'test'}
    )
    
    if login_response.status_code != 200:
        print(f"Login failed: {login_response.status_code}")
        print(f"Response: {login_response.json()}")
        return
    
    token = login_response.json().get('token')
    print(f"✓ Login successful, token: {token[:20]}...")
    
    # Get a test image
    print("\n2. Creating test image...")
    image_bytes = create_test_image()
    image_base64 = base64.b64encode(image_bytes).decode('utf-8')
    print(f"✓ Test image created, size: {len(image_bytes)} bytes")
    print(f"  Base64 length: {len(image_base64)}")
    print(f"  First 50 chars: {image_base64[:50]}...")
    
    # Test the image endpoint with base64
    print("\n3. Testing /api/chat/image endpoint with base64...")
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    
    data = {
        'image': image_base64,
        'question': 'What is in this image?'
    }
    
    response = requests.post(
        f'{BASE_URL}/api/chat/image',
        data=data,
        headers=headers
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("✓ Image endpoint works!")
    else:
        print("✗ Image endpoint failed!")

if __name__ == '__main__':
    test_image_endpoint()
