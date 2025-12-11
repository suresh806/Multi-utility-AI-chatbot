import requests
import json
import random

username = f'chattest{random.randint(100000, 999999)}'
reg_data = {'username': username, 'email': f'{username}@test.com', 'password': 'pass123'}

try:
    print("Registering user...")
    reg = requests.post('http://localhost:3000/api/auth/register', json=reg_data)
    if reg.status_code != 201:
        print("Registration failed:", reg.json())
        exit()
    
    print("Logging in...")
    login = requests.post('http://localhost:3000/api/auth/login', 
                         json={'username': username, 'password': 'pass123'})
    if login.status_code != 200:
        print("Login failed:", login.json())
        exit()
    
    token = login.json()['token']
    print("Login successful!")
    print()
    
    print("Testing chat endpoint through Node proxy...")
    chat_data = {'message': 'What is React?'}
    headers = {'Authorization': f'Bearer {token}'}
    
    chat_resp = requests.post('http://localhost:3000/api/chat', 
                             json=chat_data, headers=headers)
    print('Status:', chat_resp.status_code)
    
    if chat_resp.status_code == 200:
        result = chat_resp.json()
        reply = result.get('reply', result.get('response', str(result)))
        print()
        print('=' * 60)
        print('✅ CHAT WORKING!')
        print('=' * 60)
        print()
        print('AI Response:')
        print(reply)
    else:
        print('Error:', chat_resp.json())
    
except Exception as e:
    print('Error:', str(e)[:150])
