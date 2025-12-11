from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import ChatHistory, Message, User
from utils.ai_service import get_ai_response
import base64

bp = Blueprint('chat', __name__, url_prefix='/api/chat')

@bp.route('/histories', methods=['GET'])
@jwt_required()
def get_chat_histories():
    """Get all chat histories for current user"""
    user_id = get_jwt_identity()
    
    chat_histories = ChatHistory.query.filter_by(user_id=user_id).order_by(ChatHistory.updated_at.desc()).all()
    
    return jsonify([chat.to_dict() for chat in chat_histories]), 200

@bp.route('/create', methods=['POST'])
@jwt_required()
def create_chat():
    """Create a new chat"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    chat = ChatHistory(
        user_id=user_id,
        title=data.get('title', 'New Chat')
    )
    
    db.session.add(chat)
    db.session.commit()
    
    return jsonify(chat.to_dict()), 201

@bp.route('/<int:chat_id>', methods=['GET'])
@jwt_required()
def get_chat(chat_id):
    """Get a specific chat with all messages"""
    user_id = get_jwt_identity()
    
    chat = ChatHistory.query.filter_by(id=chat_id, user_id=user_id).first()
    
    if not chat:
        return jsonify({'error': 'Chat not found'}), 404
    
    return jsonify({
        **chat.to_dict(),
        'messages': [msg.to_dict() for msg in chat.messages]
    }), 200

@bp.route('/<int:chat_id>/delete', methods=['DELETE'])
@jwt_required()
def delete_chat(chat_id):
    """Delete a chat"""
    user_id = get_jwt_identity()
    
    chat = ChatHistory.query.filter_by(id=chat_id, user_id=user_id).first()
    
    if not chat:
        return jsonify({'error': 'Chat not found'}), 404
    
    db.session.delete(chat)
    db.session.commit()
    
    return jsonify({'message': 'Chat deleted successfully'}), 200

@bp.route('/<int:chat_id>/clear', methods=['POST'])
@jwt_required()
def clear_chat(chat_id):
    """Clear all messages in a chat"""
    user_id = get_jwt_identity()
    
    chat = ChatHistory.query.filter_by(id=chat_id, user_id=user_id).first()
    
    if not chat:
        return jsonify({'error': 'Chat not found'}), 404
    
    # Delete all messages
    Message.query.filter_by(chat_id=chat_id).delete()
    db.session.commit()
    
    return jsonify({'message': 'Chat cleared successfully'}), 200

@bp.route('', methods=['POST'])
@jwt_required()
def send_message():
    """Send a message and get AI response"""
    try:
        auth_header = request.headers.get('Authorization', 'NO HEADER')
        print(f"[DEBUG] Authorization header: {auth_header[:50] if auth_header else 'EMPTY'}")
        
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        message = data.get('message', '').strip()
        if not message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        print(f"[DEBUG] User {user_id} sent message: {message[:50]}...")
        
        # Get AI response
        print(f"[DEBUG] Calling get_ai_response...")
        reply = get_ai_response(message)
        print(f"[DEBUG] Got reply: {reply[:100] if reply else 'EMPTY'}...")
        
        if not reply:
            return jsonify({'error': 'Failed to get AI response - API may be unavailable'}), 500
        
        return jsonify({
            'message': message,
            'reply': reply,
            'response': reply
        }), 200
    except Exception as e:
        print(f"[ERROR] Chat endpoint error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Chat error: {str(e)}'}), 500

@bp.route('/image', methods=['POST'])
@jwt_required()
def analyze_image():
    """Analyze an image and answer question about it"""
    try:
        user_id = int(get_jwt_identity())
        
        print(f"\n[DEBUG] ===== IMAGE ENDPOINT CALLED =====")
        print(f"[DEBUG] Request method: {request.method}")
        print(f"[DEBUG] Content-Type: {request.content_type}")
        print(f"[DEBUG] Files keys: {list(request.files.keys())}")
        print(f"[DEBUG] Form keys: {list(request.form.keys())}")
        
        # Get image and question from request
        image_data = None
        question = request.form.get('question', 'What is in this image?').strip()
        
        print(f"[DEBUG] Question received: {question[:50]}...")
        
        # Check if file was uploaded
        if 'image' in request.files:
            image_file = request.files['image']
            print(f"[DEBUG] Found image in files: {image_file.filename}")
            file_content = image_file.read()
            print(f"[DEBUG] File size: {len(file_content)} bytes")
            image_file.seek(0)  # Reset file pointer
            
            import base64
            image_data = base64.b64encode(file_content).decode('utf-8')
            print(f"[DEBUG] Encoded as base64: {len(image_data)} chars")
            
        else:
            # Try to get from form data (for data URLs or base64 strings)
            image_form = request.form.get('image', '')
            print(f"[DEBUG] No file found, checking form data. Length: {len(image_form)}")
            
            if image_form:
                # Check if it's a data URL
                if image_form.startswith('data:'):
                    print(f"[DEBUG] Data URL detected")
                    if ',' in image_form:
                        image_data = image_form.split(',', 1)[1]
                        print(f"[DEBUG] Extracted base64 from data URL: {len(image_data)} chars")
                    else:
                        print(f"[ERROR] Data URL missing comma separator")
                else:
                    # Assume it's already base64
                    image_data = image_form
                    print(f"[DEBUG] Using base64 string directly: {len(image_data)} chars")
        
        if not image_data:
            print(f"[ERROR] No image data found after all checks")
            print(f"[DEBUG] Request files: {request.files}")
            print(f"[DEBUG] Request form: {dict(request.form)}")
            return jsonify({'error': 'No image provided'}), 400
        
        print(f"[DEBUG] Image data ready, length: {len(image_data)}")
        print(f"[DEBUG] First 50 chars of image data: {image_data[:50]}")
        
        # Get AI response for image
        print(f"[DEBUG] Calling get_ai_response with image...")
        reply = get_ai_response(f"{question}\n\n[Image Analysis]", image_data)
        print(f"[DEBUG] Got reply: {reply[:100]}...")
        
        return jsonify({
            'question': question,
            'reply': reply,
            'response': reply
        }), 200
    except Exception as e:
        print(f"[ERROR] Image analysis error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Image analysis error: {str(e)}'}), 500
