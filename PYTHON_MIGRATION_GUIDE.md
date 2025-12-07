# MERN to Python Conversion - Quick Start Guide

## Project Overview

This project has been converted from MERN stack (MongoDB, Express, React, Node.js) to a Python stack:

- **Frontend**: React 18 (unchanged - still uses React)
- **Backend**: Flask (Python)
- **Database**: SQLAlchemy ORM (SQLite for dev, PostgreSQL for prod)
- **Authentication**: JWT (same pattern as Express)

## Directory Structure

```
my-react-app/
├── src/                        # React Frontend
│   ├── App.jsx                # Main app component
│   ├── modules/               # Feature modules
│   │   ├── GeneralQAModule.jsx
│   │   ├── EducationModule.jsx
│   │   ├── HealthcareModule.jsx
│   │   ├── ProductivityModule.jsx
│   │   ├── EntertainmentModule.jsx
│   │   └── SmartServicesModule.jsx (Tools)
│   └── components/            # Reusable components
│
├── backend_python/            # Python Flask Backend (NEW)
│   ├── app.py                 # Flask application
│   ├── models.py              # SQLAlchemy ORM models
│   ├── routes/                # API route blueprints
│   │   ├── auth_routes.py
│   │   ├── chat_routes.py
│   │   └── message_routes.py
│   ├── utils/                 # Utility functions
│   │   └── ai_service.py
│   ├── requirements.txt        # Python dependencies
│   ├── .env                   # Environment variables
│   ├── SETUP.md               # Detailed setup instructions
│   └── __init__.py
│
├── build/                      # React build output
├── public/                     # React public assets
├── package.json               # Node.js dependencies (for React)
└── README.md
```

## Quick Start

### Option 1: Run Both Frontend and Backend

#### Terminal 1 - React Frontend
```bash
# Install React dependencies (first time only)
npm install

# Start React development server
npm start

# Opens at: http://localhost:3000
```

#### Terminal 2 - Python Backend
```bash
# Navigate to backend
cd backend_python

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies (first time only)
pip install -r requirements.txt

# Initialize database (first time only)
python -c "from app import app, db; app.app_context().push(); db.create_all()"

# Start Flask server
python app.py

# Runs at: http://localhost:5000
```

### Option 2: Run React Only (for frontend development)
```bash
npm install
npm start
```

### Option 3: Run Backend Only (for API testing)
```bash
cd backend_python
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

## API Endpoints (Python Backend)

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user (requires token)

### Chat Management
- `GET /api/chat/histories` - Get all chats
- `POST /api/chat/create` - Create new chat
- `GET /api/chat/<id>` - Get specific chat with messages
- `DELETE /api/chat/<id>/delete` - Delete chat
- `POST /api/chat/<id>/clear` - Clear messages in chat

### Messages & AI
- `POST /api/messages/<chat_id>/send` - Send message and get AI response
- `GET /api/messages/<chat_id>/messages` - Get all messages in chat
- `DELETE /api/messages/<id>` - Delete specific message

## Key Changes from MERN

### Backend
- **Express → Flask**: Lighter, simpler Python web framework
- **MongoDB → SQLAlchemy ORM**: Relational database with SQLite (dev) / PostgreSQL (prod)
- **Node.js → Python**: All backend logic in Python
- **Routes**: Same endpoint structure for minimal frontend changes

### Frontend
- **No changes**: React remains the same
- **API calls**: Still use same axios/fetch patterns
- **Modules**: All UI modules work with new Python backend

## Database

### Setup Database (First Time)
```bash
cd backend_python
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

### Reset Database
```bash
rm app.db  # Delete SQLite file
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

### Database Models
1. **User** - User accounts with authentication
2. **ChatHistory** - Conversation threads
3. **Message** - Individual messages (user or bot)

## Environment Variables

Create `.env` file in `backend_python/` folder:

```env
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///app.db
JWT_SECRET_KEY=your_secret_key_here
FRONTEND_URL=http://localhost:3000
SERVER_PORT=5000
```

See `backend_python/.env.example` for all available options.

## Frontend-Backend Communication

The React frontend communicates with the Python backend using the same API structure:

```javascript
// In React components
const API_URL = 'http://localhost:5000/api'

// Login example
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
})

const { access_token } = await response.json()

// Subsequent requests with token
await fetch(`${API_URL}/auth/me`, {
  headers: { 'Authorization': `Bearer ${access_token}` }
})
```

## Features

### Modules
- ✅ **Chat/Q&A** - AI-powered chat interface
- ✅ **Education** - Educational content
- ✅ **Healthcare** - Health-related information
- ✅ **Productivity** - Productivity tools
- ✅ **Entertainment** - Entertainment content
- ✅ **Tools** - Calculator, QR Code, AI Image, Currency, Weather, Stopwatch

### UI Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Sidebar navigation
- ✅ Mobile navbar with module names
- ✅ Modern styling with gradients and icons
- ✅ Full-screen module display
- ✅ Sticky chat input

## Production Deployment

### Backend Production Setup
```bash
# Use PostgreSQL instead of SQLite
DATABASE_URL=postgresql://user:pass@host:5432/mydb

# Use strong JWT secret
JWT_SECRET_KEY=<generate-strong-random-key>

# Set production environment
FLASK_ENV=production
```

See `backend_python/SETUP.md` for detailed production instructions.

## Troubleshooting

### "Port already in use"
- Change `SERVER_PORT` in `.env` to an available port
- Default React: 3000, Python Backend: 5000

### "ModuleNotFoundError"
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt`

### "Cannot connect to backend"
- Check if Flask server is running
- Verify `FRONTEND_URL` in backend `.env`
- Check CORS configuration in `app.py`

### Database errors
- Delete `app.db` and reinitialize
- Check database path in `.env`

## Next Steps

1. ✅ Python backend structure created
2. ✅ All API routes implemented
3. ✅ Database models set up
4. ✅ Authentication system ready
5. ⏳ Update React API endpoints (optional - structure is compatible)
6. ⏳ Add image upload handling
7. ⏳ Add voice input integration
8. ⏳ Deploy to production

## File Changes Summary

### Created
- `backend_python/` - Complete Python Flask backend
- `backend_python/app.py` - Flask application
- `backend_python/models.py` - Database models
- `backend_python/routes/` - API routes
- `backend_python/utils/` - Utility functions

### Unchanged
- `src/` - React frontend (all modules working)
- `package.json` - Node dependencies for React
- `public/` - React public files

### Removed (Optional)
- `backend/` - Old Express backend (if migrating completely)

## Support & Documentation

- **Flask**: https://flask.palletsprojects.com/
- **SQLAlchemy**: https://docs.sqlalchemy.org/
- **Flask-JWT-Extended**: https://flask-jwt-extended.readthedocs.io/
- **Python Guide**: https://python.readthedocs.io/

## Development Tips

### Hot Reload
Flask automatically reloads on file changes when `FLASK_DEBUG=True`

### Testing API
```bash
# Test backend endpoints
curl http://localhost:5000/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"user","email":"user@test.com","password":"pass"}'
```

### Database Inspection
```bash
# Connect to SQLite
sqlite3 app.db

# View tables
.tables

# View schema
.schema
```

---

**Status**: Python backend migration complete ✅
**Next**: Run both services and test integration
