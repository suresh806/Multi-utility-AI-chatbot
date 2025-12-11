import os
from dotenv import load_dotenv

# Load from .env
load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')
print(f'GEMINI_API_KEY exists: {bool(api_key)}')
if api_key:
    print(f'First 20 chars: {api_key[:20]}')
    print(f'Length: {len(api_key)}')
else:
    print('GEMINI_API_KEY is None')

# Now test Gemini initialization
print('\n--- Testing Gemini ---')
from utils.ai_service import initialize_gemini, GEMINI_READY, get_ai_response

print(f'Initial GEMINI_READY: {GEMINI_READY}')
result = initialize_gemini()
print(f'After initialize_gemini(): {result}')

# Try a simple API call
print('\n--- Testing API Call ---')
response = get_ai_response("What is 2+2?")
print(f'Response: {response[:100] if response else "None"}...')
