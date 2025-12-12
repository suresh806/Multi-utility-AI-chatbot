# SmartServices AI - Startup Guide

## Quick Start (2 Terminals)

### Terminal 1 - Backend (Flask)
```bash
cd backend_python
python app.py
```
✅ Runs on: http://localhost:5000

### Terminal 2 - Frontend (Node.js)
```bash
node server.js
```
✅ Runs on: http://localhost:3000

---

## OR - Development Mode (2 Terminals)

### Terminal 1 - Backend (Flask)
```bash
cd backend_python
python app.py
```

### Terminal 2 - Frontend (React Dev Server with Hot Reload)
```bash
npm start
```
✅ Runs on: http://localhost:3000 or http://localhost:3001 (if 3000 busy)

---

## OR - Production Build (1 Terminal)

```bash
npm run build
node server.js
```
✅ Runs on: http://localhost:3000

---

## Testing

Run end-to-end tests:
```bash
python test_complete_e2e.py
```

Expected output:
```
✅ REGISTRATION TEST: 201
✅ LOGIN TEST: 200  
✅ CHAT TEST: 200
✅ AI Response received
```

---

## Requirements

Make sure both are running:
- Backend: http://localhost:5000/health → Should return 200 OK
- Frontend: http://localhost:3000 → Should load React app

---

## Common Issues

**Port already in use?**
```bash
# Kill process on port 3000
taskkill /F /IM node.exe

# Kill process on port 5000
taskkill /F /IM python.exe
```

**Frontend shows "Network error"?**
- Check if Flask backend is running on port 5000
- Check if Node server is running on port 3000
- Run: `python test_complete_e2e.py`

---

## Features

✅ User Registration & Login (JWT)
✅ Chat with AI (Google Gemini 2.5 Flash)
✅ Image Analysis 
✅ Session Management
✅ API Proxy (Node routes /api to Flask)

---

**Note:** You need a valid Google Gemini API key in `backend_python/.env`:
```
GEMINI_API_KEY=your_key_here
```

Currently, the API key is disabled. You need to get a new one from Google Cloud Console.
