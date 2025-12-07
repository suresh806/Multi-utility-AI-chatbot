#!/usr/bin/env python
"""Direct test of Gemini API without Flask"""
import os
from dotenv import load_dotenv

load_dotenv()

print("1. Testing imports...")
try:
    import google.generativeai as genai
    print("✓ google-generativeai imported")
except Exception as e:
    print(f"✗ Import failed: {e}")
    exit(1)

print("\n2. Checking API key...")
api_key = os.getenv('GEMINI_API_KEY')
if api_key:
    print(f"✓ API key found: {api_key[:20]}...")
else:
    print("✗ API key not found")
    exit(1)

print("\n3. Configuring Gemini...")
try:
    genai.configure(api_key=api_key)
    print("✓ Gemini configured")
except Exception as e:
    print(f"✗ Configuration failed: {e}")
    exit(1)

print("\n4. Creating model...")
try:
    model = genai.GenerativeModel('gemini-2.5-flash')
    print("✓ Model created: gemini-2.5-flash")
except Exception as e:
    print(f"✗ Model creation failed: {e}")
    exit(1)

print("\n5. Testing text generation...")
try:
    print("   Sending: 'What is Python?'")
    response = model.generate_content("What is Python?")
    print(f"✓ Response received!")
    print(f"\nResponse object: {response}")
    print(f"\nResponse.text: {response.text[:200] if response.text else 'NONE'}")
    
    if response.text:
        print(f"\n✓✓✓ SUCCESS! Got response: {response.text[:100]}...")
    else:
        print("\n✗✗✗ PROBLEM: response.text is None or empty")
        print(f"Response object details: {dir(response)}")
        
except Exception as e:
    print(f"✗ Generation failed: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
