from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from database import db
from models import User
import requests
import os
from datetime import datetime
import json

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    """Register a new user"""
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 409
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 409
        
        # Create new user
        user = User(username=data['username'], email=data['email'])
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Registration error: {str(e)}'}), 500

@bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    """Login user and return access token"""
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Missing username or password'}), 400
        
        user = User.query.filter_by(username=data['username']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid username or password'}), 401
        
        # Create access token (use string identity for newer Flask-JWT-Extended)
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'token': access_token,
            'user': user.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'Login error: {str(e)}'}), 500

@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (token invalidation handled by frontend)"""
    return jsonify({'message': 'Logged out successfully'}), 200

@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user information"""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200

@bp.route('/google/callback', methods=['POST'])
def google_callback():
    """Handle Google OAuth callback"""
    data = request.get_json()
    code = data.get('code')
    
    if not code:
        return jsonify({'error': 'No authorization code provided'}), 400
    
    try:
        # Exchange code for token (in production, use real Google Client Secret)
        # For now, we'll create a user based on the code
        google_client_id = os.getenv('GOOGLE_CLIENT_ID', 'placeholder')
        google_client_secret = os.getenv('GOOGLE_CLIENT_SECRET', 'placeholder')
        
        # In production, exchange code with Google here
        # For demo, we'll create a test user
        username = f"google_user_{code[:8]}"
        email = f"{username}@gmail.com"
        
        # Check if user exists, otherwise create
        user = User.query.filter_by(email=email).first()
        
        if not user:
            user = User(username=username, email=email)
            user.set_password(f"oauth_{code}")  # OAuth users have random password
            db.session.add(user)
            db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        # Record login history
        login_history = {
            'provider': 'google',
            'timestamp': datetime.utcnow().isoformat(),
            'user_agent': request.headers.get('User-Agent', '')
        }
        
        if not hasattr(user, 'login_history') or not user.login_history:
            user.login_history = json.dumps([login_history])
        else:
            history = json.loads(user.login_history)
            history.append(login_history)
            user.login_history = json.dumps(history[-50:])  # Keep last 50
        
        db.session.commit()
        
        return jsonify({
            'token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'OAuth authentication failed: {str(e)}'}), 400

@bp.route('/github/callback', methods=['POST'])
def github_callback():
    """Handle GitHub OAuth callback"""
    data = request.get_json()
    code = data.get('code')
    
    if not code:
        return jsonify({'error': 'No authorization code provided'}), 400
    
    try:
        # Exchange code for token (in production, use real GitHub Client Secret)
        # For now, we'll create a user based on the code
        github_client_id = os.getenv('GITHUB_CLIENT_ID', 'placeholder')
        github_client_secret = os.getenv('GITHUB_CLIENT_SECRET', 'placeholder')
        
        # In production, exchange code with GitHub here
        # For demo, we'll create a test user
        username = f"github_user_{code[:8]}"
        email = f"{username}@github.com"
        
        # Check if user exists, otherwise create
        user = User.query.filter_by(email=email).first()
        
        if not user:
            user = User(username=username, email=email)
            user.set_password(f"oauth_{code}")  # OAuth users have random password
            db.session.add(user)
            db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        # Record login history
        login_history = {
            'provider': 'github',
            'timestamp': datetime.utcnow().isoformat(),
            'user_agent': request.headers.get('User-Agent', '')
        }
        
        if not hasattr(user, 'login_history') or not user.login_history:
            user.login_history = json.dumps([login_history])
        else:
            history = json.loads(user.login_history)
            history.append(login_history)
            user.login_history = json.dumps(history[-50:])  # Keep last 50
        
        db.session.commit()
        
        return jsonify({
            'token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'OAuth authentication failed: {str(e)}'}), 400

@bp.route('/login-history/<username>', methods=['GET'])
@jwt_required()
def get_login_history(username):
    """Get login history for a user"""
    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    history = []
    if hasattr(user, 'login_history') and user.login_history:
        try:
            history = json.loads(user.login_history)
        except:
            history = []
    
    return jsonify({
        'username': user.username,
        'history': history
    }), 200

