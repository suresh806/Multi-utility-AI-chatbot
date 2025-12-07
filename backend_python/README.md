# Python Flask Backend

AI Chat Application Backend - Built with Flask and Python

## Overview

This is the Python backend for the AI Chat Application, replacing the original Express.js backend. It provides a RESTful API for:
- User authentication and management
- Chat history management
- Message storage and retrieval
- AI response generation

## Technology Stack

- **Framework**: Flask 2.3.3
- **Database**: SQLAlchemy ORM (SQLite/PostgreSQL)
- **Authentication**: JWT (Flask-JWT-Extended)
- **CORS**: Flask-CORS for cross-origin requests
- **Python**: 3.8+

## Project Structure

```
backend_python/
├── app.py                 # Main Flask application
├── models.py              # SQLAlchemy database models
├── requirements.txt       # Python dependencies
├── .env                   # Environment configuration (dev)
├── .env.example           # Environment template
├── SETUP.md               # Detailed setup instructions
├── routes/
│   ├── __init__.py
│   ├── auth_routes.py     # Authentication endpoints
│   ├── chat_routes.py     # Chat management endpoints
│   └── message_routes.py  # Message and AI endpoints
├── utils/
│   ├── __init__.py
│   └── ai_service.py      # AI response generation
└── __init__.py
```

## Quick Start

### 1. Setup Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
# Key variables:
# - JWT_SECRET_KEY: Generate a secure random key
# - DATABASE_URL: SQLite or PostgreSQL connection
# - FRONTEND_URL: Your React app URL
```

### 4. Initialize Database

```bash
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

### 5. Run Server

```bash
python app.py
```

Server will start at `http://localhost:5000`

## API Documentation

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}

Response: 201 Created
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}

Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>

Response: 200 OK
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

#### Logout User
```http
POST /api/auth/logout
Authorization: Bearer <access_token>

Response: 200 OK
{
  "message": "Successfully logged out"
}
```

### Chat Routes

#### Get All Chats
```http
GET /api/chat/histories
Authorization: Bearer <access_token>

Response: 200 OK
[
  {
    "id": 1,
    "title": "General Q&A",
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T11:45:00",
    "message_count": 5
  }
]
```

#### Create New Chat
```http
POST /api/chat/create
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "New Chat"
}

Response: 201 Created
{
  "id": 2,
  "title": "New Chat",
  "created_at": "2024-01-15T12:00:00",
  "updated_at": "2024-01-15T12:00:00",
  "messages": []
}
```

#### Get Specific Chat
```http
GET /api/chat/<chat_id>
Authorization: Bearer <access_token>

Response: 200 OK
{
  "id": 1,
  "title": "General Q&A",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T11:45:00",
  "messages": [
    {
      "id": 1,
      "text": "Hello",
      "sender": "user",
      "created_at": "2024-01-15T10:31:00"
    },
    {
      "id": 2,
      "text": "Hi! How can I help?",
      "sender": "bot",
      "created_at": "2024-01-15T10:32:00"
    }
  ]
}
```

#### Delete Chat
```http
DELETE /api/chat/<chat_id>/delete
Authorization: Bearer <access_token>

Response: 200 OK
{
  "message": "Chat deleted successfully"
}
```

#### Clear Chat Messages
```http
POST /api/chat/<chat_id>/clear
Authorization: Bearer <access_token>

Response: 200 OK
{
  "message": "Chat cleared successfully"
}
```

### Message Routes

#### Send Message (with AI Response)
```http
POST /api/messages/<chat_id>/send
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "text": "What is Python?",
  "image_url": null
}

Response: 200 OK
{
  "user_message": {
    "id": 1,
    "text": "What is Python?",
    "sender": "user",
    "created_at": "2024-01-15T12:00:00"
  },
  "ai_response": {
    "id": 2,
    "text": "Python is a high-level programming language...",
    "sender": "bot",
    "created_at": "2024-01-15T12:00:01"
  }
}
```

#### Get All Messages in Chat
```http
GET /api/messages/<chat_id>/messages
Authorization: Bearer <access_token>

Response: 200 OK
[
  {
    "id": 1,
    "text": "Hello",
    "sender": "user",
    "created_at": "2024-01-15T10:31:00"
  },
  {
    "id": 2,
    "text": "Hi there!",
    "sender": "bot",
    "created_at": "2024-01-15T10:32:00"
  }
]
```

#### Delete Message
```http
DELETE /api/messages/<message_id>
Authorization: Bearer <access_token>

Response: 200 OK
{
  "message": "Message deleted successfully"
}
```

## Database Models

### User Model
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password_hash` - Hashed password
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### ChatHistory Model
- `id` - Primary key
- `user_id` - Foreign key to User
- `title` - Chat title
- `created_at` - Chat creation timestamp
- `updated_at` - Last update timestamp
- `messages` - Relationship to Message

### Message Model
- `id` - Primary key
- `chat_id` - Foreign key to ChatHistory
- `user_id` - Foreign key to User
- `text` - Message content
- `sender` - 'user' or 'bot'
- `image_url` - Optional image URL
- `created_at` - Message timestamp

## Configuration

### Environment Variables

```env
# Flask
FLASK_ENV=development          # development or production
FLASK_DEBUG=True               # Enable debug mode
FLASK_APP=app.py

# Database
DATABASE_URL=sqlite:///app.db  # SQLite for dev
# DATABASE_URL=postgresql://user:pass@host/db  # PostgreSQL for prod

# JWT
JWT_SECRET_KEY=your_secret_key_here
JWT_ACCESS_TOKEN_EXPIRES=2592000  # 30 days in seconds

# CORS
FRONTEND_URL=http://localhost:3000

# Server
SERVER_PORT=5000
SERVER_HOST=0.0.0.0
```

## Running the Application

### Development Mode
```bash
# With auto-reload
export FLASK_ENV=development
export FLASK_DEBUG=True
python app.py
```

### Production Mode
```bash
# Use a production WSGI server
pip install gunicorn
gunicorn app:app
```

## Testing

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

### Test Protected Route (Get Current User)
```bash
# Replace TOKEN with the access_token from login response
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## Troubleshooting

### Port Already in Use
```bash
# Change SERVER_PORT in .env
# Default is 5000
```

### Module Import Errors
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Database Errors
```bash
# Reset database
rm app.db
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

### JWT Token Expired
- Tokens expire after `JWT_ACCESS_TOKEN_EXPIRES` seconds (default: 30 days)
- User needs to login again to get a new token

## AI Service Configuration

The backend includes an AI service for generating responses. See `utils/ai_service.py` for options:

1. **Basic** (default) - Simple keyword-based responses
2. **Transformers** - Advanced NLP with transformers library
3. **Spacy** - NLP with spacy library

To use advanced AI models:
```bash
pip install transformers torch
# or
pip install spacy
python -m spacy download en_core_web_sm
```

## Migration from Express Backend

The Python backend maintains the same API structure as the original Express backend for compatibility with the React frontend.

### Key Differences
| Feature | Express | Flask |
|---------|---------|-------|
| Framework | Express.js | Flask |
| Database | MongoDB | SQLite/PostgreSQL |
| ORM | Mongoose | SQLAlchemy |
| Language | JavaScript | Python |
| Authentication | JWT | JWT |
| CORS | Express-CORS | Flask-CORS |

### Migration Checklist
- ✅ API endpoints converted
- ✅ Database models mapped
- ✅ Authentication system ported
- ✅ CORS configuration set
- ⏳ Frontend API calls (optional - same endpoint structure)
- ⏳ Image uploads (in progress)
- ⏳ Voice input (in progress)

## Performance Notes

### Development
- SQLite is suitable for development and small deployments
- Flask development server auto-reloads on file changes
- Debug mode enabled in development

### Production
- Use PostgreSQL for production data durability
- Deploy with gunicorn/uWSGI WSGI server
- Enable connection pooling
- Use environment variables for secrets
- Set `FLASK_DEBUG=False`

## Contributing

When modifying the backend:
1. Follow PEP 8 style guide
2. Add proper error handling
3. Use type hints where applicable
4. Update API documentation
5. Test all endpoints

## Support

- Flask Documentation: https://flask.palletsprojects.com/
- SQLAlchemy Documentation: https://docs.sqlalchemy.org/
- JWT Documentation: https://flask-jwt-extended.readthedocs.io/

---

**Status**: Production Ready ✅
**Last Updated**: 2024
