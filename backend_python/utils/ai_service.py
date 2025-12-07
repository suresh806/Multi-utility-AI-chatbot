"""
AI Service for generating responses using Google Gemini 2.5 Flash API
Supports multiple backends: Gemini (PRIMARY), HuggingFace, transformers, spacy, etc.
"""
import os
import requests
import json
from datetime import datetime

# Initialize Gemini API
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("Note: google-generativeai not installed. Install with: pip install google-generativeai")

_GEMINI_INITIALIZED = False
GEMINI_READY = False

def initialize_gemini():
    """Initialize Gemini API with API key from environment"""
    global _GEMINI_INITIALIZED, GEMINI_READY
    
    # Only initialize once
    if _GEMINI_INITIALIZED:
        return GEMINI_READY
    
    _GEMINI_INITIALIZED = True
    
    if not GEMINI_AVAILABLE:
        print("Gemini API not available. Install google-generativeai package.")
        GEMINI_READY = False
        return False
    
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("Warning: GEMINI_API_KEY not found in environment variables")
        GEMINI_READY = False
        return False
    
    try:
        genai.configure(api_key=api_key)
        print("[OK] Gemini API initialized successfully")
        GEMINI_READY = True
        return True
    except Exception as e:
        print(f"Error initializing Gemini: {e}")
        GEMINI_READY = False
        return False

# Try to initialize now, but don't fail if .env not loaded yet
# It will be initialized on first use
try:
    initialize_gemini()
except:
    pass

# Knowledge base for enhanced responses
KNOWLEDGE_BASE = {
    'react': """React is a JavaScript library for building user interfaces with reusable components.

Key Features:
• Component-based architecture - Break UI into reusable pieces
• Virtual DOM - Efficient rendering and performance optimization
• JSX - JavaScript XML for writing UI elements
• State Management - Manage component data with useState hook
• Lifecycle Hooks - useEffect, useContext, useReducer, etc.
• Unidirectional Data Flow - Predictable data management

Installation:
```bash
npx create-react-app my-app
cd my-app
npm start
```

Basic Component Example:
```jsx
function MyComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

Best Practices:
• Use functional components with hooks
• Keep components small and focused
• Use PropTypes or TypeScript for type checking
• Memoize expensive computations with useMemo
• Use lazy loading for code splitting""",

    'javascript': """JavaScript is a versatile programming language that powers interactive web applications.

Core Concepts:
• Variables: let, const, var
• Data Types: String, Number, Boolean, Object, Array, null, undefined
• Functions: Regular, Arrow, Async/Await
• Objects & Prototypes - Inheritance model
• Promises - Handling asynchronous operations
• ES6+ Features - Classes, Destructuring, Spread operator

Async/Await Example:
```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

Best Practices:
• Always use 'const' by default
• Use arrow functions for cleaner syntax
• Use async/await instead of .then()
• Avoid callback hell with proper error handling
• Use const for immutability
• Destructuring for cleaner code""",

    'css': """CSS (Cascading Style Sheets) is used for styling web pages and creating layouts.

Layout Systems:
• Flexbox: 1D layout for rows/columns
• Grid: 2D layout for complex designs
• Positioning: static, relative, absolute, fixed
• Box Model: margin, border, padding, content

Flexbox Example:
```css
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
```

Grid Example:
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}
```

Modern Features:
• CSS Variables: --color-primary
• Animations & Transitions
• Media Queries for responsive design
• CSS Filters for effects
• Backdrop filters for blur effects
• CSS Gradients for backgrounds""",

    'api': """REST APIs (Representational State Transfer) are web services for data exchange.

HTTP Methods:
• GET - Retrieve data (safe, idempotent)
• POST - Create new data
• PUT/PATCH - Update existing data
• DELETE - Remove data

API Request Example:
```javascript
const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
});

const data = await response.json();
```

Best Practices:
• Use proper HTTP status codes (200, 201, 400, 401, 404, 500)
• Include error messages in responses
• Use JSON for data format
• Implement rate limiting
• Add API documentation (Swagger/OpenAPI)
• Use CORS headers for cross-origin requests""",

    'security': """Web Security Best Practices for protecting applications and user data.

Common Vulnerabilities:
• XSS (Cross-Site Scripting) - Inject malicious scripts
• CSRF (Cross-Site Request Forgery) - Unauthorized actions
• SQL Injection - Malicious SQL queries
• Man-in-the-Middle (MITM) - Intercept communications
• DDoS - Denial of Service attacks

Protection Strategies:
• Use HTTPS/TLS for encryption
• Sanitize user input on frontend and backend
• Use Content Security Policy (CSP)
• Implement CORS properly
• Use HTTPOnly cookies for sensitive data
• Hash and salt passwords (bcrypt, argon2)
• Keep dependencies updated
• Use environment variables for secrets
• Implement rate limiting
• Add security headers (X-Frame-Options, X-Content-Type-Options)

Code Example:
```javascript
// Sanitize user input
const sanitized = userInput.replace(/[<>]/g, '');

// Use parameterized queries for databases
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);

// Set secure headers
app.use(helmet()); // Express.js security middleware
```""",

    'python': """Python is a high-level, versatile programming language.

Core Features:
• Simple, readable syntax
• Dynamic typing
• Extensive standard library
• Object-oriented and functional programming
• Decorators and generators

Common Frameworks:
• Flask/Django for web development
• NumPy/Pandas for data science
• TensorFlow/PyTorch for machine learning
• Requests for HTTP operations

Flask Example:
```python
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({'message': 'Hello, World!'})

@app.route('/api/data', methods=['POST'])
def post_data():
    data = request.get_json()
    return jsonify(data), 201

if __name__ == '__main__':
    app.run(debug=True)
```

Best Practices:
• Use virtual environments
• Follow PEP 8 style guide
• Use type hints (Python 3.5+)
• Write unit tests with pytest
• Use docstrings for documentation"""
}

def get_ai_response(user_input: str, image_data: str = None) -> str:
    """
    Get AI response for user input with optional image analysis
    Tries Gemini API first (PRIMARY), then falls back to intelligent response generation
    
    Args:
        user_input: User's message text
        image_data: Optional base64 encoded image data
    
    Returns:
        AI generated response text
    """
    
    if not user_input.strip():
        return "I'm here to help! Please ask me something."
    
    # Ensure Gemini is initialized (loads .env if not yet loaded)
    if not _GEMINI_INITIALIZED:
        initialize_gemini()
    
    print(f"\n=== GET_AI_RESPONSE CALLED ===")
    print(f"Input: {user_input[:50]}...")
    print(f"GEMINI_READY: {GEMINI_READY}")
    
    # Try Gemini API first (PRIMARY)
    if GEMINI_READY:
        try:
            print("[...] Attempting Gemini API call...")
            response = call_gemini_api(user_input, image_data)
            if response:
                print(f"[OK] Got Gemini response, returning it")
                return response
            else:
                print("[!] Gemini returned None, trying fallbacks")
        except Exception as e:
            print(f"[!] Gemini API error: {e}, falling back to intelligent response")
    else:
        print("[...] GEMINI not ready, skipping to fallbacks")
    
    # Check if question matches knowledge base
    print("[...] Checking knowledge base...")
    lower_input = user_input.lower()
    for keyword, content in KNOWLEDGE_BASE.items():
        if keyword in lower_input:
            print(f"[OK] Found keyword '{keyword}' in knowledge base, returning it")
            return content
    
    print("[!] No keyword match in knowledge base")
    
    # Try external API (HuggingFace, etc.)
    try:
        print("[...] Attempting external API call...")
        response = call_external_ai_api(user_input, image_data)
        if response:
            print(f"[OK] Got external API response, returning it")
            return response
        else:
            print("[!] External API returned None")
    except Exception as e:
        print(f"[!] External API error: {e}")
    
    # Fallback to intelligent response generation
    print("[...] Using intelligent response generation fallback")
    result = generate_intelligent_response(user_input, image_data)
    print(f"[OK] Returning intelligent response")
    return result

def call_gemini_api(user_input: str, image_data: str = None) -> str:
    """
    Call Google Gemini 2.5 Flash API for AI response
    Supports both text and image inputs
    
    Args:
        user_input: User's question or message
        image_data: Optional base64 encoded image data
    
    Returns:
        Response text from Gemini, or None if failed
    """
    try:
        if not GEMINI_READY:
            print("DEBUG: GEMINI_READY is False")
            return None
        
        print(f"DEBUG: Calling Gemini API with input: {user_input[:50]}...")
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        if image_data:
            # Handle image analysis request
            try:
                import base64
                from PIL import Image
                import io
                
                # Extract base64 data
                if ',' in image_data:
                    base64_str = image_data.split(',')[1]
                else:
                    base64_str = image_data
                
                # Decode base64 to image
                image_bytes = base64.b64decode(base64_str)
                image = Image.open(io.BytesIO(image_bytes))
                
                print("DEBUG: Sending image + text to Gemini")
                # Generate response with both text and image
                response = model.generate_content([user_input, image])
                
                if response and response.text:
                    print(f"DEBUG: Gemini returned image response: {response.text[:50]}...")
                    return response.text
                    
            except Exception as e:
                print(f"Image processing error: {e}")
                # Fall back to text-only response
                print("DEBUG: Falling back to text-only after image error")
                response = model.generate_content(user_input)
                result = response.text if response and response.text else None
                if result:
                    print(f"DEBUG: Text-only fallback returned: {result[:50]}...")
                return result
        else:
            # Text-only response
            print("DEBUG: Sending text-only request to Gemini")
            response = model.generate_content(user_input)
            
            print(f"DEBUG: Response object type: {type(response)}")
            print(f"DEBUG: Response object: {response}")
            print(f"DEBUG: Response.text type: {type(response.text) if hasattr(response, 'text') else 'NO TEXT ATTR'}")
            
            if response and response.text:
                print(f"DEBUG: Gemini returned text response: {response.text[:50]}...")
                return response.text
            else:
                print(f"DEBUG: Gemini response is empty or missing text. Response: {response}")
        
        return None
        
    except Exception as e:
        print(f"GEMINI API ERROR: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return None

def call_external_ai_api(user_input: str, image_data: str = None) -> str:
    """
    Call external AI API (HuggingFace or similar)
    Note: Gemini 2.5 Flash is now PRIMARY backend (see call_gemini_api)
    This is a fallback option if Gemini is unavailable
    """
    try:
        # Try HuggingFace Inference API (free tier available)
        api_token = os.getenv('HUGGINGFACE_API_KEY', '')
        
        if api_token:
            headers = {"Authorization": f"Bearer {api_token}"}
            
            # Use text generation model
            api_url = "https://api-inference.huggingface.co/models/gpt2"
            
            payload = {
                "inputs": user_input,
                "parameters": {
                    "max_length": 200,
                    "num_return_sequences": 1
                }
            }
            
            response = requests.post(api_url, headers=headers, json=payload, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    return result[0].get('generated_text', '')
        
        return None
        
    except Exception as e:
        print(f"HuggingFace API error: {e}")
        return None

def generate_intelligent_response(user_input: str, image_data: str = None) -> str:
    """
    Generate intelligent response using pattern matching and enhanced logic
    """
    lower_input = user_input.lower()
    
    # Question type detection
    if any(word in lower_input for word in ['what', 'who', 'where', 'when', 'why', 'how']):
        response_type = "question"
    else:
        response_type = "statement"
    
    # Greeting responses
    greetings = {
        'hello': "Hello! 👋 How can I assist you today?",
        'hi': "Hi there! 👋 What can I help you with?",
        'hey': "Hey! 😊 What's on your mind?",
        'good morning': "Good morning! ☀️ Ready to help!",
        'good afternoon': "Good afternoon! ☀️ What do you need?",
        'good evening': "Good evening! 🌙 How can I help?",
    }
    
    for greeting, response in greetings.items():
        if greeting in lower_input:
            return response
    
    # Help/Support responses
    if any(word in lower_input for word in ['help', 'support', 'assist', 'can you']):
        return """I'm here to help! I can assist you with:

📚 **Learning Topics:**
• Programming (React, JavaScript, Python, CSS)
• Web Development & APIs
• Security Best Practices
• Data Structures & Algorithms

🛠️ **Technical Assistance:**
• Code explanations
• Debugging help
• Best practices
• Framework recommendations

💡 **Questions I can answer:**
• How to build things
• Why certain approaches work
• Comparisons between technologies
• Step-by-step tutorials

Just ask me anything specific and I'll provide detailed help! 😊"""
    
    # Thank you responses
    thanks_words = ['thanks', 'thank you', 'appreciate', 'grateful']
    if any(word in lower_input for word in thanks_words):
        return "You're welcome! 😊 Feel free to ask if you need anything else. I'm always here to help!"
    
    # Goodbye responses
    if any(word in lower_input for word in ['bye', 'goodbye', 'see you', 'farewell']):
        return "Goodbye! 👋 Have a great day and happy coding! Feel free to reach out anytime."
    
    # Image-related responses
    if image_data:
        return f"""I see you've uploaded an image! 📸

I can help you with:
• Explaining code shown in the image
• Debugging issues
• Suggesting improvements
• Understanding UI/UX designs

Could you describe what you'd like me to help with regarding this image? For example:
• "Explain this code"
• "Find the bug"
• "How can I improve this?"
• "What does this do?"

Please provide additional context so I can give you the best answer! 😊"""
    
    # Default intelligent response
    return f"""That's an interesting question about '{user_input}'! 🤔

I can provide detailed information on:
• **Technical explanations** - How things work under the hood
• **Code examples** - Practical implementations and patterns
• **Best practices** - Industry standards and recommendations
• **Troubleshooting** - Debugging and solving problems
• **Learning paths** - Step-by-step guidance

Could you be more specific? For example:
• "How do I...?" - I'll provide step-by-step guidance
• "What is...?" - I'll explain the concept
• "Why does...?" - I'll explain the reasoning
• "Compare X and Y" - I'll show differences and use cases

Feel free to ask follow-up questions! 😊"""

def get_ai_response_with_transformers(user_input: str) -> str:
    """
    Get AI response using transformers library
    Requires: pip install transformers torch
    """
    try:
        from transformers import pipeline
        
        # Initialize the conversation pipeline
        conversation = pipeline("conversational", model="microsoft/DialoGPT-medium")
        
        # Generate response
        response = conversation(user_input)
        
        return response[0]['generated_text'] if response else "I couldn't generate a response. Please try again."
    except ImportError:
        return "Transformers library not installed. Install with: pip install transformers torch"
    except Exception as e:
        return f"Error generating response: {str(e)}"

def get_ai_response_with_spacy(user_input: str) -> str:
    """
    Get AI response using spacy for NLP
    Requires: pip install spacy
    """
    try:
        import spacy
        
        # Load the model
        nlp = spacy.load("en_core_web_sm")
        
        # Process text
        doc = nlp(user_input)
        
        # Generate a response based on entities
        entities = [ent.label_ for ent in doc.ents]
        
        if entities:
            return f"I detected entities of types: {', '.join(set(entities))}. Could you provide more context?"
        
        return "I understand you're asking about this. Could you provide more details?"
    except ImportError:
        return "Spacy library not installed. Install with: pip install spacy && python -m spacy download en_core_web_sm"
    except Exception as e:
        return f"Error processing text: {str(e)}"
