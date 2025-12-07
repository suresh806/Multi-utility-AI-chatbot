# Python Backend Setup Guide

This guide will help you set up the Python Flask backend for the AI Chat Application.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (optional but recommended)

## Installation Steps

### 1. Create a Virtual Environment (Recommended)

```bash
cd backend_python
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and update the configuration:
# - JWT_SECRET_KEY: Change to a secure random string
# - DATABASE_URL: Set your database connection
# - FRONTEND_URL: Set your React app URL
```

### 4. Initialize the Database

```bash
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

Or create a simple setup script (optional):

```bash
python setup.py
```

### 5. Run the Flask Server

```bash
python app.py

# Or use Flask CLI:
flask run
```

The API will be available at: `http://localhost:5000`

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Chat Routes
- `GET /api/chat/histories` - Get all chats (protected)
- `POST /api/chat/create` - Create new chat (protected)
- `GET /api/chat/<id>` - Get specific chat (protected)
- `DELETE /api/chat/<id>/delete` - Delete chat (protected)
- `POST /api/chat/<id>/clear` - Clear chat messages (protected)

### Message Routes
- `POST /api/messages/<chat_id>/send` - Send message and get AI response (protected)
- `GET /api/messages/<chat_id>/messages` - Get all messages (protected)
- `DELETE /api/messages/<id>` - Delete message (protected)

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

JWT tokens are obtained from the `/api/auth/login` endpoint.

## Database

### Models

1. **User** - User account information
   - username (unique)
   - email (unique)
   - password_hash
   - created_at, updated_at

2. **ChatHistory** - Chat conversation records
   - title
   - user_id (foreign key)
   - created_at, updated_at
   - relationship: messages

3. **Message** - Individual messages in chat
   - text
   - sender (user or bot)
   - image_url (optional)
   - chat_id (foreign key)
   - user_id (foreign key)
   - created_at

### Database Migration (Future)

For production deployments, use Alembic:

```bash
pip install alembic
alembic init migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## AI Service Configuration

The backend includes a basic AI response system with support for multiple backends:

### 1. Basic (Default)
Simple rule-based responses. No additional setup required.

### 2. Transformers
Requires: `pip install transformers torch`

```python
from utils.ai_service import get_ai_response_with_transformers
response = get_ai_response_with_transformers(user_input)
```

### 3. Spacy NLP
Requires: `pip install spacy` and download model `python -m spacy download en_core_web_sm`

```python
from utils.ai_service import get_ai_response_with_spacy
response = get_ai_response_with_spacy(user_input)
```

## Troubleshooting

### Port Already in Use
If port 5000 is already in use:
```bash
# Change in .env:
SERVER_PORT=5001
```

### Database Errors
Delete the SQLite database and reinitialize:
```bash
rm app.db
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

### Import Errors
Ensure virtual environment is activated and all dependencies are installed:
```bash
pip install -r requirements.txt
```

### JWT Issues
Make sure `JWT_SECRET_KEY` is set in .env and is a strong random string.

## Development vs Production

### Development
```
FLASK_ENV=development
DATABASE_URL=sqlite:///app.db
JWT_SECRET_KEY=dev_key_change_this
```

### Production
```
FLASK_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET_KEY=<strong_random_key>
FRONTEND_URL=https://yourdomain.com
```

## Frontend Integration

Update React API calls to use the new Python backend:

```javascript
// Old Express backend
const API_URL = 'http://localhost:5000/api'

// Use same URL - endpoints are compatible
const response = await axios.post(`${API_URL}/auth/login`, {
  username: 'user',
  password: 'pass'
})
```

## Next Steps

1. ✅ Backend structure created
2. ✅ Database models defined
3. ✅ API routes implemented
4. ✅ Authentication system set up
5. ⏳ Update React frontend to use new backend
6. ⏳ Test all endpoints
7. ⏳ Deploy to production

## Support

For issues or questions, check:
- Flask documentation: https://flask.palletsprojects.com/
- SQLAlchemy documentation: https://docs.sqlalchemy.org/
- JWT documentation: https://flask-jwt-extended.readthedocs.io/
