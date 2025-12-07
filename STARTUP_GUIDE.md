#!/bin/bash
# START_SERVICES_GUIDE.md - Complete startup guide for the application

# ╔════════════════════════════════════════════════════════════════╗
# ║                                                                ║
# ║  🚀 STARTUP GUIDE - Google Gemini 2.5 Flash AI Application  ║
# ║                                                                ║
# ╚════════════════════════════════════════════════════════════════╝

## 🎯 Quick Start (2 Minutes)

### Option 1: Using Batch Script (Windows)
```batch
# Double-click this file:
START_SERVICES.bat
```

### Option 2: Using Shell Script (Mac/Linux)
```bash
# Run this command:
bash start_services.sh
```

### Option 3: Manual Start (All Platforms)

#### Terminal 1 - Backend
```bash
cd backend_python
python app.py
```

Expected output:
```
✓ Gemini API initialized successfully
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

#### Terminal 2 - Frontend
```bash
npm start
```

Expected output:
```
webpack compiled...
You can now view my-react-app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## ✅ Verification Checklist

After starting both services, verify everything is working:

### 1. Backend is Running
- ✅ Terminal 1 shows "Running on http://0.0.0.0:5000"
- ✅ No error messages about port conflicts
- ✅ Gemini API initialized message shows

### 2. Frontend is Running
- ✅ Terminal 2 shows "webpack compiled"
- ✅ http://localhost:3000 opens in browser
- ✅ Application loads without errors

### 3. Features Working
- ✅ Can type in General Q&A module
- ✅ Can click voice button 🎤
- ✅ Can click image button 📷
- ✅ Can click "New Chat" button
- ✅ Dark/light mode toggle works

### 4. AI Responses
- ✅ Type "Hello" → Get greeting response
- ✅ Type "What is React?" → Get Gemini response
- ✅ Click voice → Record & get response
- ✅ Click image → Upload & analyze

---

## 🧪 Testing the Integration

### Quick API Test
```bash
# From backend_python directory:
python test_gemini.py
```

Should show:
```
✅ TEST 1: Package Imports                 PASSED
✅ TEST 2: API Key Configuration          PASSED
✅ TEST 3: Gemini API Initialization      PASSED
✅ TEST 4: Gemini Text Generation         PASSED
✅ TEST 5: AI Service Integration         PASSED
✅ TEST 6: Backend Routes                 PASSED

Success Rate: 100.0%
```

### Manual Endpoint Test
```bash
# Test text message
curl -X POST http://localhost:5000/api/messages/1/send \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello!"}'

# Expected: Returns AI response
```

---

## 🔧 Troubleshooting

### Issue: "Port 5000 already in use"
```
Solution 1: Kill the existing process
  Windows: netstat -ano | findstr :5000
           taskkill /PID <PID> /F
  Mac/Linux: lsof -ti:5000 | xargs kill -9

Solution 2: Change port in .env
  FLASK_PORT=5001
  Then start with: python app.py
```

### Issue: "Port 3000 already in use"
```
Solution: Kill the process using port 3000
  Windows: netstat -ano | findstr :3000
           taskkill /PID <PID> /F
  Mac/Linux: lsof -ti:3000 | xargs kill -9
```

### Issue: "GEMINI_API_KEY not found"
```
Solution: Verify .env file
1. Check backend_python/.env exists
2. Verify GEMINI_API_KEY=AIzaSyC0pLF83vesv528... is there
3. Restart Flask server
4. If still failing, run: python test_gemini.py
```

### Issue: "Module not found" error
```
Solution: Install dependencies
  Backend: pip install -r backend_python/requirements.txt
  Frontend: npm install
```

### Issue: Slow responses from Gemini
```
Solution: Usually just first load
1. Wait 2-3 seconds for Gemini to respond
2. Check internet connection
3. Verify API key is active
4. Check Google Cloud Console for rate limits
```

---

## 📊 System Requirements

### Minimum
- **OS**: Windows 10, macOS 10.14+, Ubuntu 18.04+
- **RAM**: 4 GB
- **Disk**: 2 GB free
- **Python**: 3.8+
- **Node.js**: 14+
- **Internet**: Required (for Gemini API)

### Recommended
- **OS**: Windows 11, macOS 12+, Ubuntu 20.04+
- **RAM**: 8 GB
- **Disk**: 5 GB SSD
- **Python**: 3.10+
- **Node.js**: 18+
- **Connection**: Broadband (for faster responses)

---

## 🎓 Guided Tour

After starting, here's what to explore:

### 1. Landing Page (Main)
- Shows overview of all modules
- 8 feature boxes
- Navigation to modules

### 2. General Q&A Module (AI Powered)
- Type questions → Get AI responses
- Click 🎤 to record voice
- Click 📷 to upload images
- Click "New Chat" to start fresh
- See suggested questions at top

### 3. Entertainment Module
- Play 3 games:
  - Memory Game (match pairs)
  - Hangman (guess letters)
  - Speed Game (quick reactions)

### 4. SmartServices Module
- 6 utility tools:
  - Calculator
  - Stopwatch
  - Weather widget
  - To-do list
  - QR Code generator
  - Text tools

### 5. Healthcare Module
- Health tips and information
- Wellness resources
- Medical references

### 6. Other Modules
- Education Module
- Productivity Module
- Info Module
- AI Image Generator

---

## 🔐 Security Notes

### API Key Protection
```
✅ Key is in .env (git-ignored)
✅ Never shown in logs
✅ Never transmitted insecurely
✅ Stored in environment variables
```

### Best Practices
```
1. Never commit .env to public repo
2. Never share API key in messages/emails
3. For production, use secure secrets manager
4. Rotate key periodically
5. Monitor usage in Google Cloud Console
```

---

## 📈 Performance Tips

### For Faster Responses
1. **Restart Backend**: Fresh connection to Gemini
2. **Clear Cache**: Ctrl+Shift+Delete in browser
3. **Reduce Image Size**: Smaller images = faster analysis
4. **Use Broadband**: Better internet = faster API

### Monitor Performance
- Open DevTools (F12)
- Go to Network tab
- Watch response times
- Should be < 2 seconds

---

## 🚀 Production Deployment

### Before Deploying
1. ✅ Run full test suite
2. ✅ Build React app: `npm run build`
3. ✅ Update .env for production
4. ✅ Switch to PostgreSQL (optional)
5. ✅ Set up monitoring

### Deploy Options
- **Heroku**: Free/paid tier
- **AWS**: EC2, Lambda, or Elastic Beanstalk
- **Google Cloud**: App Engine or Cloud Run
- **Azure**: App Service or Container Instances
- **DigitalOcean**: Droplets or App Platform

### Environment Setup
```
Production .env:
FLASK_ENV=production
FLASK_DEBUG=False
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET_KEY=<strong-random-key>
GEMINI_API_KEY=<your-api-key>
FRONTEND_URL=https://yourdomain.com
```

---

## 📞 Support Resources

### Documentation Files
- `QUICK_REFERENCE.md` - Quick commands
- `GEMINI_SETUP_COMPLETE.md` - Detailed setup
- `GEMINI_INTEGRATION_COMPLETE.md` - Architecture
- `IMPLEMENTATION_COMPLETE.md` - Full status

### Online Resources
- Gemini API Docs: https://ai.google.dev
- Flask Docs: https://flask.palletsprojects.com
- React Docs: https://react.dev
- Node.js Docs: https://nodejs.org

### Troubleshooting
- Check logs in terminal
- Run test suite: `python test_gemini.py`
- Verify .env configuration
- Check browser console (F12)

---

## 🎯 Common Commands

### Backend
```bash
# Start server
cd backend_python && python app.py

# Run tests
cd backend_python && python test_gemini.py

# Install dependencies
pip install -r backend_python/requirements.txt

# Check Python version
python --version

# Activate virtual environment (if using venv)
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
```

### Frontend
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Install dependencies
npm install

# Check Node version
node --version
```

### Database
```bash
# Create database (auto-created on first run)
cd backend_python
python -c "from app import app, db; app.app_context().push(); db.create_all()"

# Reset database
rm backend_python/app.db

# Check SQLite
sqlite3 backend_python/app.db ".schema"
```

---

## 🎉 First-Time Checklist

- [ ] Download/clone the project
- [ ] Install Python dependencies: `pip install -r backend_python/requirements.txt`
- [ ] Install Node dependencies: `npm install`
- [ ] Verify .env file exists: `backend_python/.env`
- [ ] Run tests: `python backend_python/test_gemini.py`
- [ ] Start backend: `cd backend_python && python app.py`
- [ ] Start frontend: `npm start` (in new terminal)
- [ ] Open http://localhost:3000
- [ ] Test voice feature
- [ ] Test image upload
- [ ] Explore all modules

---

## 📝 Example Prompts to Try

### Text Questions
- "What is React?"
- "Explain JavaScript async/await"
- "How do I make a responsive CSS grid?"
- "What's the difference between REST and GraphQL?"
- "How do I secure a web application?"

### Voice Input
- Click 🎤
- Say: "What is Python?"
- Get instant voice response

### Image Analysis
- Click 📷
- Upload a code screenshot
- Ask: "Explain this code"
- Get detailed analysis

---

## ✨ Features Summary

✅ **Text Input** - Ask any question
✅ **Voice Input** - Speak your question  
✅ **Image Analysis** - Upload code/designs
✅ **AI Responses** - Powered by Gemini 2.5 Flash
✅ **8 Modules** - Different feature areas
✅ **Dark Mode** - Eye-friendly interface
✅ **Responsive** - Works on all devices
✅ **Production Ready** - Deploy anywhere

---

## 🚀 You're Ready!

Everything is configured and tested. Just run:

```bash
# Terminal 1
cd backend_python && python app.py

# Terminal 2 (new terminal)
npm start
```

Then open: **http://localhost:3000**

Enjoy your AI-powered application! 🎉

---

**Last Updated:** December 1, 2024
**Status:** ✅ PRODUCTION READY
**Version:** 1.0.0
**Support:** See documentation files for detailed guides
