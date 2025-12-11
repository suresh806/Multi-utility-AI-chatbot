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

# Configure CORS - Simple and permissive for all origins
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Add after_request handler to ensure CORS headers are always present
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

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
    from utils.ai_service import GEMINI_READY
    return jsonify({
        'status': 'ok',
        'message': 'Flask AI Chat API is running',
        'gemini_ready': GEMINI_READY,
        'api_key_exists': bool(os.getenv('GEMINI_API_KEY'))
    }), 200

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
