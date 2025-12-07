import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///chat_app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize extensions
from database import db
db.init_app(app)
jwt = JWTManager(app)

# Configure CORS with more permissive settings for development
frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
cors_origins = [
    frontend_url,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
]

# Add Render frontend URL if it exists
render_url = os.getenv('RENDER_EXTERNAL_URL')
if render_url:
    cors_origins.append(render_url)

CORS(app, 
     origins=cors_origins,
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# Models
from models import User, Message, ChatHistory

# Routes
from routes import auth_routes, chat_routes, message_routes

# Register blueprints
app.register_blueprint(auth_routes.bp)
app.register_blueprint(chat_routes.bp)
app.register_blueprint(message_routes.bp)

@app.before_request
def before_request():
    """Create tables before first request"""
    with app.app_context():
        db.create_all()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Flask AI Chat API is running'}), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(
        debug=os.getenv('FLASK_ENV', 'development') == 'development',
        host=os.getenv('SERVER_HOST', '0.0.0.0'),
        port=int(os.getenv('SERVER_PORT', 5000)),
        use_reloader=False
    )
