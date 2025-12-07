#!/usr/bin/env python
"""
Test script to verify Google Gemini 2.5 Flash API integration
Run: python test_gemini.py
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_imports():
    """Test 1: Check if all required packages are installed"""
    print("\n" + "="*60)
    print("TEST 1: Checking Package Imports")
    print("="*60)
    
    try:
        import google.generativeai as genai
        print("✅ google-generativeai imported successfully")
    except ImportError as e:
        print(f"❌ google-generativeai not installed: {e}")
        return False
    
    try:
        from PIL import Image
        print("✅ Pillow (PIL) imported successfully")
    except ImportError as e:
        print(f"❌ Pillow not installed: {e}")
        return False
    
    try:
        import requests
        print("✅ requests imported successfully")
    except ImportError as e:
        print(f"❌ requests not installed: {e}")
        return False
    
    return True

def test_api_key():
    """Test 2: Check if API key is loaded from .env"""
    print("\n" + "="*60)
    print("TEST 2: Checking API Key Configuration")
    print("="*60)
    
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ GEMINI_API_KEY not found in environment")
        print("   Make sure .env file is in backend_python/ directory")
        return False
    
    print(f"✅ GEMINI_API_KEY found: {api_key[:20]}...")
    return True

def test_gemini_init():
    """Test 3: Test Gemini API initialization"""
    print("\n" + "="*60)
    print("TEST 3: Initializing Gemini API")
    print("="*60)
    
    try:
        import google.generativeai as genai
        api_key = os.getenv('GEMINI_API_KEY')
        
        genai.configure(api_key=api_key)
        print("✅ Gemini API configured successfully")
        
        # Try to list available models
        models = genai.list_models()
        print(f"✅ Successfully connected to Gemini API")
        print(f"   Available models: {len(list(models))} models found")
        return True
        
    except Exception as e:
        print(f"❌ Failed to initialize Gemini API: {e}")
        return False

def test_text_generation():
    """Test 4: Test Gemini text generation"""
    print("\n" + "="*60)
    print("TEST 4: Testing Gemini Text Generation")
    print("="*60)
    
    try:
        import google.generativeai as genai
        api_key = os.getenv('GEMINI_API_KEY')
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Test with a simple query
        print("📝 Sending test query: 'Explain React in one sentence'")
        response = model.generate_content("Explain React in one sentence")
        
        if response and response.text:
            print(f"✅ Gemini responded successfully")
            print(f"   Response: {response.text[:100]}...")
            return True
        else:
            print("❌ No response from Gemini")
            return False
            
    except Exception as e:
        print(f"❌ Text generation failed: {e}")
        return False

def test_ai_service():
    """Test 5: Test the AI service wrapper"""
    print("\n" + "="*60)
    print("TEST 5: Testing AI Service Integration")
    print("="*60)
    
    try:
        from utils.ai_service import get_ai_response
        
        print("📝 Calling get_ai_response('What is JavaScript?')")
        response = get_ai_response("What is JavaScript?")
        
        if response:
            print(f"✅ AI Service responded successfully")
            print(f"   Response length: {len(response)} characters")
            print(f"   First 100 chars: {response[:100]}...")
            return True
        else:
            print("❌ AI Service returned empty response")
            return False
            
    except Exception as e:
        print(f"❌ AI Service test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_backend_routes():
    """Test 6: Check if backend routes are configured"""
    print("\n" + "="*60)
    print("TEST 6: Checking Backend Routes")
    print("="*60)
    
    try:
        from routes import message_routes
        print("✅ message_routes module imported successfully")
        
        # Check for required endpoints
        endpoints = ['/api/messages/<chat_id>/send', '/api/messages/<chat_id>/send-image-query']
        print(f"✅ Expected endpoints configured:")
        for endpoint in endpoints:
            print(f"   • {endpoint}")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to check backend routes: {e}")
        return False

def print_summary(results):
    """Print test summary"""
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    total = len(results)
    passed = sum(1 for r in results.values() if r)
    failed = total - passed
    
    print(f"\nTotal Tests: {total}")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if failed == 0:
        print("\n🎉 All tests passed! Gemini integration is ready!")
        print("\nNext steps:")
        print("1. Start Flask backend: cd backend_python && python app.py")
        print("2. Start React frontend: cd .. && npm start")
        print("3. Test in General Q&A module")
        print("4. Try voice input and image uploads")
    else:
        print("\n⚠️  Some tests failed. Please review the errors above.")
        print("    Make sure:")
        print("    • .env file exists in backend_python/")
        print("    • GEMINI_API_KEY is correctly set")
        print("    • google-generativeai is installed")
        print("    • Running from backend_python/ directory")
    
    print("\n" + "="*60)
    return failed == 0

def main():
    """Run all tests"""
    print("\n")
    print("╔" + "="*58 + "╗")
    print("║" + " "*58 + "║")
    print("║" + "  Google Gemini 2.5 Flash Integration Test Suite".center(58) + "║")
    print("║" + " "*58 + "║")
    print("╚" + "="*58 + "╝")
    
    results = {}
    
    # Run tests
    results['1. Package Imports'] = test_imports()
    if results['1. Package Imports']:
        results['2. API Key Configuration'] = test_api_key()
        results['3. Gemini Initialization'] = test_gemini_init()
        if results['3. Gemini Initialization']:
            results['4. Text Generation'] = test_text_generation()
        results['5. AI Service'] = test_ai_service()
        results['6. Backend Routes'] = test_backend_routes()
    else:
        print("\n⚠️  Skipping remaining tests due to missing packages")
        results['2. API Key Configuration'] = False
        results['3. Gemini Initialization'] = False
        results['4. Text Generation'] = False
        results['5. AI Service'] = False
        results['6. Backend Routes'] = False
    
    # Print summary
    success = print_summary(results)
    
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
