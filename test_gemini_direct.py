import sys
sys.path.insert(0, 'backend_python')

from dotenv import load_dotenv
load_dotenv('backend_python/.env')

from utils.ai_service import GEMINI_READY, initialize_gemini, call_gemini_api

print("Testing Gemini API...")
print(f"GEMINI_READY on import: {GEMINI_READY}")
print()

print("Initializing Gemini...")
result = initialize_gemini()
print(f"Init result: {result}")
print()

print("Attempting Gemini API call...")
response = call_gemini_api("What is 2+2?")
print(f"Response: {response}")
