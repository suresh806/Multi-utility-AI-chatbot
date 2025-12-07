from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from database import db
from models import Message, ChatHistory, User
from utils.ai_service import get_ai_response
import base64

bp = Blueprint('message', __name__, url_prefix='/api/messages')

@bp.route('/<int:chat_id>/send', methods=['POST'])
@jwt_required()
def send_message(chat_id):
    """Send a message and get AI response with optional image and voice support"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Verify chat belongs to user
    chat = ChatHistory.query.filter_by(id=chat_id, user_id=user_id).first()
    if not chat:
        return jsonify({'error': 'Chat not found'}), 404
    
    # Get message content
    message_text = data.get('text', '')
    voice_input = data.get('voice_text', '')  # Transcribed voice text
    image_data = data.get('image')  # Base64 encoded image
    
    # Combine voice and text input
    if voice_input:
        message_text = voice_input if not message_text else f"{message_text} [Voice: {voice_input}]"
    
    if not message_text.strip():
        return jsonify({'error': 'Message cannot be empty'}), 400
    
    # Save user message
    user_message = Message(
        chat_id=chat_id,
        user_id=user_id,
        text=message_text,
        sender='user',
        image_url=image_data
    )
    
    db.session.add(user_message)
    db.session.commit()
    
    # Get AI response (pass image data for analysis if present)
    ai_response_text = get_ai_response(message_text, image_data)
    
    # Save AI response
    ai_message = Message(
        chat_id=chat_id,
        user_id=user_id,
        text=ai_response_text,
        sender='bot'
    )
    
    db.session.add(ai_message)
    db.session.commit()
    
    # Update chat timestamp
    chat.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        'user_message': user_message.to_dict(),
        'ai_message': ai_message.to_dict()
    }), 201

@bp.route('/<int:chat_id>/send-image-query', methods=['POST'])
@jwt_required()
def send_image_query(chat_id):
    """Send an image with a query for analysis"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Verify chat belongs to user
    chat = ChatHistory.query.filter_by(id=chat_id, user_id=user_id).first()
    if not chat:
        return jsonify({'error': 'Chat not found'}), 404
    
    image_data = data.get('image')
    query_text = data.get('query', 'Analyze this image')
    
    if not image_data:
        return jsonify({'error': 'Image data required'}), 400
    
    # Save user message with image
    user_message = Message(
        chat_id=chat_id,
        user_id=user_id,
        text=f"Image Query: {query_text}",
        sender='user',
        image_url=image_data
    )
    
    db.session.add(user_message)
    db.session.commit()
    
    # Get AI response for image analysis
    ai_response_text = get_ai_response(query_text, image_data)
    
    # Save AI response
    ai_message = Message(
        chat_id=chat_id,
        user_id=user_id,
        text=ai_response_text,
        sender='bot'
    )
    
    db.session.add(ai_message)
    db.session.commit()
    
    # Update chat timestamp
    chat.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        'user_message': user_message.to_dict(),
        'ai_message': ai_message.to_dict()
    }), 201

@bp.route('/<int:chat_id>/messages', methods=['GET'])
@jwt_required()
def get_messages(chat_id):
    """Get all messages in a chat"""
    user_id = get_jwt_identity()
    
    chat = ChatHistory.query.filter_by(id=chat_id, user_id=user_id).first()
    if not chat:
        return jsonify({'error': 'Chat not found'}), 404
    
    messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.created_at).all()
    
    return jsonify([msg.to_dict() for msg in messages]), 200

@bp.route('/<int:message_id>', methods=['DELETE'])
@jwt_required()
def delete_message(message_id):
    """Delete a specific message"""
    user_id = get_jwt_identity()
    
    message = Message.query.filter_by(id=message_id, user_id=user_id).first()
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    
    db.session.delete(message)
    db.session.commit()
    
    return jsonify({'message': 'Message deleted successfully'}), 200
