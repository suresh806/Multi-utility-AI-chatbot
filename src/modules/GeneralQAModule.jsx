import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { HelpCircle, Trash2, SendHorizontal, Lightbulb, Mic, Image as ImageIcon, RefreshCw, X, Copy, Check, Settings } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function GeneralQAModule({ darkMode = false }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState({});
  const [listening, setListening] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [isLoadedSession, setIsLoadedSession] = useState(false); // Track if current session is loaded
  const [chatId, setChatId] = useState(() => {
    // Use a persistent chat ID from localStorage, or create new one
    const saved = localStorage.getItem('currentChatId');
    if (saved) return saved;
    const newId = 'chat_' + Date.now();
    localStorage.setItem('currentChatId', newId);
    return newId;
  });
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatSessions, setChatSessions] = useState(() => {
    const saved = localStorage.getItem('chatSessions');
    return saved ? JSON.parse(saved) : [];
  });
  const scrollRef = React.useRef(null);
  const recognitionRef = React.useRef(null);
  const fileInputRef = React.useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setListening(true);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };
    }
  }, []);

  // Load chat history from localStorage when chatId changes
  useEffect(() => {
    console.log('\n>>> EFFECT: chatId changed to', chatId);
    const savedMessages = localStorage.getItem(chatId);
    console.log('>>> Looking for messages with key:', chatId);
    console.log('>>> Found:', !!savedMessages);
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        console.log('>>> ✓ Loaded', parsed.length, 'messages');
        console.log('>>> First message:', parsed[0]?.text?.substring(0, 50));
        setMessages(parsed);
      } catch (error) {
        console.error('>>> ✗ Error parsing:', error);
        setMessages([]);
      }
    } else {
      console.log('>>> ✗ No messages found, clearing');
      setMessages([]);
    }
  }, [chatId]);

  // Save chat sessions to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    console.log('Chat sessions saved:', chatSessions.length);
  }, [chatSessions]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        const saved = JSON.stringify(messages);
        localStorage.setItem(chatId, saved);
        console.log('✓ Saved', messages.length, 'messages to localStorage');
        console.log('  Storage key:', chatId);
        console.log('  First msg:', messages[0]?.text?.substring(0, 40) || 'N/A');
      } catch (error) {
        console.error('✗ Failed to save messages:', error);
      }
    }
  }, [messages, chatId]);

  // Suggested questions
  const suggestedQuestions = [
    "What is React and how does it work?",
    "How do I optimize my code performance?",
    "Explain JavaScript async/await",
    "What are CSS Grid and Flexbox?",
    "How does REST API work?",
    "Best practices for web security",
    "What is state management?",
    "How to debug efficiently?"
  ];

  // Auto-scroll when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Toggle voice input
  const toggleVoice = () => {
    if (recognitionRef.current) {
      if (listening) {
        recognitionRef.current.stop();
        setListening(false);
      } else {
        recognitionRef.current.start();
      }
    }
  };

  // Handle image selection
  const handleImageSelect = (file) => {
    console.log('[DEBUG] handleImageSelect called with:', { file: file?.name, size: file?.size, type: file?.type });
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('[DEBUG] FileReader onload - got data URL of length:', e.target.result.length);
        setPendingImage({
          name: file.name,
          dataUrl: e.target.result,
          file: file
        });
        console.log('[DEBUG] Pending image set:', { name: file.name });
      };
      reader.onerror = (err) => {
        console.error('[ERROR] FileReader error:', err);
      };
      reader.readAsDataURL(file);
    } else {
      console.warn('[WARN] No file provided to handleImageSelect');
    }
  };

  // Get AI response from backend (real API)
  const getAIResponse = async (userMessage, imageData = null) => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.REACT_APP_API_URL || '/api';

      console.log('[DEBUG] getAIResponse called with:', { userMessage, hasImage: !!imageData, token: !!token, baseUrl });

      if (imageData) {
        // Prepare image data for sending
        let imageBase64 = '';
        if (imageData.dataUrl) {
          // Extract base64 from data URL
          if (imageData.dataUrl.includes(',')) {
            imageBase64 = imageData.dataUrl.split(',')[1];
          } else {
            imageBase64 = imageData.dataUrl;
          }
          console.log('[DEBUG] Using dataUrl, extracted base64:', imageBase64.substring(0, 50) + '...');
        }
        
        // Create form data with base64 string
        const formData = new FormData();
        formData.append('image', imageBase64);
        formData.append('question', userMessage || "What's in this image?");

        console.log('[DEBUG] Sending image request to:', `${baseUrl}/api/chat/image`);
        console.log('[DEBUG] Image data length:', imageBase64.length);
        console.log('[DEBUG] Question:', userMessage);
        
        try {
          const res = await axios.post(`${baseUrl}/api/chat/image`, formData, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            timeout: 30000 // 30 second timeout
          });
          console.log('[DEBUG] Image response:', res.data);
          const reply = res.data.reply || res.data.response || '';
          if (!reply) {
            console.warn('[WARN] Image response is empty');
            return "I received your image but couldn't generate a response. Please try again.";
          }
          return reply;
        } catch (imageErr) {
          console.error('[ERROR] Image request failed:', {
            message: imageErr.message,
            status: imageErr.response?.status,
            data: imageErr.response?.data
          });
          throw imageErr;
        }
      }

      console.log('[DEBUG] Sending text request to:', `${baseUrl}/api/chat`);
      const res = await axios.post(`${baseUrl}/api/chat`, { message: userMessage }, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000 // 30 second timeout
      });
      console.log('[DEBUG] Text response:', res.data);
      const reply = res.data.reply || res.data.response || '';
      if (!reply) {
        console.warn('[WARN] Text response is empty');
        return "I couldn't generate a response. Please try again.";
      }
      return reply;
    } catch (err) {
      console.error('[ERROR] getAIResponse failed:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        code: err.code,
        url: err.config?.url,
        headers: err.config?.headers
      });
      
      if (err.response?.status === 401) {
        return "Authentication failed. Please login again.";
      } else if (err.response?.status === 400) {
        const errorMsg = err.response?.data?.error || 'Invalid input';
        console.error('[ERROR] Bad request error:', errorMsg);
        return `Error: ${errorMsg}`;
      } else if (err.code === 'ECONNABORTED') {
        return "Request timeout. Please try again.";
      } else if (err.message === 'Network Error') {
        return "Network error. Please check your connection and that backend is running on port 5000.";
      } else if (!err.response) {
        return "Cannot reach the backend server. Is it running on port 5000?";
      }
      
      return "Sorry, I couldn't get a response right now. Please try again later.";
    }
  };

  // Handle sending message
  const handleSend = async () => {
    if (!input.trim() && !pendingImage) return;

    const userMsg = {
      id: Date.now(),
      text: input,
      image: pendingImage ? pendingImage.dataUrl : null,
      who: "user",
      time: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    const imageData = pendingImage;
    setPendingImage(null);
    setLoading(true);

    try {
      const aiResponse = await getAIResponse(input, imageData);
      
      if (!aiResponse) {
        console.error("No response received from AI");
        setLoading(false);
        return;
      }

      const botMsgId = Date.now() + 1;
      const botMsg = {
        id: botMsgId,
        text: "",
        who: "bot",
        time: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
      setTypingMessageId(botMsgId);

      // Typing animation - add one character at a time with 1ms delay
      let displayedText = "";
      for (let i = 0; i < aiResponse.length; i++) {
        displayedText += aiResponse[i];
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMsgId ? { ...msg, text: displayedText } : msg
          )
        );
        // Typing speed - 1ms per character for very fast animation
        await new Promise(resolve => setTimeout(resolve, 1));
      }
      
      setTypingMessageId(null);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message to chat
      const errorMsg = {
        id: Date.now() + 2,
        text: "Sorry, something went wrong. Please try again.",
        who: "bot",
        time: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Handle suggestion click
  const handleSuggestion = (question) => {
    setInput(question);
  };

  // Copy message to clipboard
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [id]: false })), 2000);
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
  };

  // New chat
  const newChat = () => {
    console.log('\n=== NEW CHAT ===');
    console.log('Current messages:', messages.length);
    console.log('Current chatId:', chatId);
    console.log('Is loaded session:', isLoadedSession);
    
    // Only save if it's a NEW chat with messages (not a loaded session)
    if (messages.length > 0 && !isLoadedSession) {
      const preview = messages[0]?.text?.substring(0, 50) || 'New Chat';
      
      // FIRST: Save the messages to localStorage with the current chatId
      console.log('Saving NEW messages to localStorage for chatId:', chatId);
      localStorage.setItem(chatId, JSON.stringify(messages));
      console.log('✓ Messages saved to localStorage');
      
      // SECOND: Add session to history
      const newSession = {
        id: chatId,
        title: preview,
        timestamp: new Date().toLocaleString(),
        messageCount: messages.length
      };
      console.log('Saving session to history:', newSession);
      
      // Use functional update to ensure we have latest state
      setChatSessions(prevSessions => {
        const updated = [newSession, ...prevSessions];
        console.log('✓ Session added to history. Total sessions:', updated.length);
        return updated;
      });
    } else if (isLoadedSession) {
      console.log('✓ Skipping save - this is a loaded session, not a new one');
    } else {
      console.log('No messages to save, skipping history save');
    }
    
    setMessages([]);
    setInput("");
    setPendingImage(null);
    setIsLoadedSession(false); // Reset flag for new chat
    
    // Create new chat
    console.log('Creating new chat with new ID');
    
    const newId = 'chat_' + Date.now();
    console.log('New chat ID:', newId);
    localStorage.setItem('currentChatId', newId);
    setChatId(newId);
    console.log('=== END NEW CHAT ===\n');
  };

  // Load previous chat session
  const loadChatSession = useCallback((sessionId) => {
    console.log('\n=== LOADING CHAT SESSION ===');
    console.log('Session ID:', sessionId);
    
    // Check what's stored in localStorage
    const stored = localStorage.getItem(sessionId);
    if (stored) {
      try {
        const msgs = JSON.parse(stored);
        console.log('✓ Found', msgs.length, 'messages in localStorage for this session');
      } catch (e) {
        console.error('✗ Error parsing stored messages:', e);
      }
    } else {
      console.warn('✗ No messages found in localStorage for session:', sessionId);
      console.log('Available localStorage keys:', Object.keys(localStorage).filter(k => k.startsWith('chat_')));
    }
    
    // Update localStorage and chatId
    // This will trigger the useEffect to load messages
    localStorage.setItem('currentChatId', sessionId);
    setChatId(sessionId);
    setIsLoadedSession(true); // Mark this as a loaded session
    setShowChatHistory(false);
    
    console.log('=== END LOADING ===\n');
  }, []);

  // Delete chat session
  const deleteChatSession = (sessionIdToDelete) => {
    console.log('\n=== DELETE SESSION ===');
    console.log('Deleting session:', sessionIdToDelete);
    console.log('Current chatId:', chatId);
    console.log('Current sessions count:', chatSessions.length);
    
    // Filter out the deleted session
    const updated = chatSessions.filter(s => s.id !== sessionIdToDelete);
    console.log('After filter:', updated.length, 'sessions remain');
    
    // Update the sessions state
    setChatSessions(updated);
    
    // Save to localStorage
    localStorage.setItem('chatSessions', JSON.stringify(updated));
    localStorage.removeItem(sessionIdToDelete);
    console.log('✓ Session removed from localStorage');
    
    // If deleting the current session, switch to another or create new
    if (chatId === sessionIdToDelete) {
      console.log('Deleted session is current, switching...');
      if (updated.length > 0) {
        // Switch to the most recent session
        const nextSessionId = updated[0].id;
        console.log('Switching to session:', nextSessionId);
        loadChatSession(nextSessionId);
      } else {
        // No sessions left, create a new one
        console.log('No sessions left, creating new empty chat');
        setMessages([]);
        setInput("");
        setPendingImage(null);
        setIsLoadedSession(false);
        const newId = 'chat_' + Date.now();
        localStorage.setItem('currentChatId', newId);
        setChatId(newId);
      }
    } else {
      console.log('✓ Deleted session is not current, no switch needed');
    }
    console.log('=== END DELETE ===\n');
  };

  // Render message with markdown and syntax highlighting
  const renderMessageText = (text) => {
    return (
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'text';
            const code = String(children).replace(/\n$/, '');

            if (!inline) {
              return (
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <SyntaxHighlighter
                    language={language}
                    style={dracula}
                    customStyle={{
                      borderRadius: '8px',
                      padding: '1rem',
                      fontSize: '0.85rem',
                      lineHeight: '1.5'
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                      setCopied(prev => ({ ...prev, [code]: true }));
                      setTimeout(() => setCopied(prev => ({ ...prev, [code]: false })), 2000);
                    }}
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      color: '#fff',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'all 0.2s ease',
                      hover: { background: 'rgba(255, 255, 255, 0.2)' }
                    }}
                    onMouseEnter={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.2)'; }}
                    onMouseLeave={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.1)'; }}
                  >
                    {copied[code] ? (
                      <>
                        <Check size={14} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy
                      </>
                    )}
                  </button>
                </div>
              );
            }

            return (
              <code
                style={{
                  background: darkMode ? '#1f2d42' : '#f3f4f6',
                  color: darkMode ? '#e8f0ff' : '#1f2937',
                  padding: '0.2rem 0.4rem',
                  borderRadius: '4px',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.9em'
                }}
                {...props}
              >
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p style={{ marginBottom: '0.75rem', lineHeight: '1.6' }}>{children}</p>;
          },
          ul({ children }) {
            return <ul style={{ marginLeft: '1.5rem', marginBottom: '0.75rem' }}>{children}</ul>;
          },
          ol({ children }) {
            return <ol style={{ marginLeft: '1.5rem', marginBottom: '0.75rem' }}>{children}</ol>;
          },
          li({ children }) {
            return <li style={{ marginBottom: '0.25rem' }}>{children}</li>;
          },
          h1({ children }) {
            return <h1 style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '0.75rem' }}>{children}</h1>;
          },
          h2({ children }) {
            return <h2 style={{ fontSize: '1.3em', fontWeight: 'bold', marginBottom: '0.5rem' }}>{children}</h2>;
          },
          h3({ children }) {
            return <h3 style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '0.5rem' }}>{children}</h3>;
          },
          blockquote({ children }) {
            return (
              <blockquote
                style={{
                  borderLeft: `3px solid ${darkMode ? '#3b82f6' : '#3b82f6'}`,
                  paddingLeft: '1rem',
                  marginLeft: 0,
                  marginBottom: '0.75rem',
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  fontStyle: 'italic'
                }}
              >
                {children}
              </blockquote>
            );
          }
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: window.innerWidth < 480 ? '100dvh' : '100vh',
      background: darkMode ? '#0f1720' : '#f8fafc',
      borderRadius: window.innerWidth < 768 ? '0px' : '12px',
      overflow: 'hidden',
      gap: 0,
    }}>
      {/* Header */}
      <div style={{
        background: darkMode ? 'linear-gradient(135deg, #1f2d42 0%, #151a33 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderBottom: `1px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`,
        padding: 'clamp(0.75rem, 3vw, 1.25rem)',
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'clamp(0.5rem, 2vw, 0.75rem)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 1rem)' }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: 'white',
            width: window.innerWidth < 480 ? '36px' : 'clamp(32px, 8vw, 40px)',
            height: window.innerWidth < 480 ? '36px' : 'clamp(32px, 8vw, 40px)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <HelpCircle size={window.innerWidth < 480 ? 18 : 20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 'clamp(1rem, 4vw, 1.2rem)', fontWeight: '700', color: darkMode ? '#e8f0ff' : '#1f2937' }}>Q&A</h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', color: darkMode ? '#a8afc7' : '#6b7280' }}>Ask anything</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'clamp(0.5rem, 1.5vw, 0.75rem)', flexWrap: 'wrap-reverse' }}>
          <button
            onClick={newChat}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              border: 'none',
              color: 'white',
              padding: window.innerWidth < 480 ? '0.5rem 0.7rem' : 'clamp(0.5rem, 1.5vw, 0.6rem) clamp(0.75rem, 2vw, 1rem)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.35rem, 1vw, 0.5rem)',
              fontSize: window.innerWidth < 480 ? '0.75rem' : 'clamp(0.75rem, 2vw, 0.85rem)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ➕ <span style={{ display: { xs: 'none', sm: 'inline' } }}>New</span>
          </button>
          <button
            onClick={() => setShowChatHistory(!showChatHistory)}
            style={{
              background: showChatHistory ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : (darkMode ? '#1f2d42' : '#f3f4f6'),
              border: `1px solid ${showChatHistory ? '#3b82f6' : (darkMode ? '#2a3f5f' : '#e5e7eb')}`,
              color: showChatHistory ? 'white' : (darkMode ? '#e8f0ff' : '#374151'),
              padding: 'clamp(0.5rem, 1.5vw, 0.6rem) clamp(0.75rem, 2vw, 1rem)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.3rem, 0.8vw, 0.4rem)',
              fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          >
            <Settings size={16} /> History
          </button>
          <button
            onClick={clearChat}
            style={{
              background: darkMode ? '#1f2d42' : '#f3f4f6',
              border: `1px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`,
              color: darkMode ? '#e8f0ff' : '#374151',
              padding: window.innerWidth < 480 ? '0.5rem 0.7rem' : 'clamp(0.5rem, 1.5vw, 0.6rem) clamp(0.75rem, 2vw, 1rem)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.3rem, 0.8vw, 0.4rem)',
              fontSize: window.innerWidth < 480 ? '0.75rem' : 'clamp(0.75rem, 2vw, 0.85rem)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = darkMode ? '#2a3f5f' : '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = darkMode ? '#1f2d42' : '#f3f4f6';
            }}
          >
            <Trash2 size={16} /> Clear
          </button>
        </div>

        {/* Chat History Sessions Panel - Desktop (inline) */}
        {showChatHistory && window.innerWidth >= 768 && (
          <div style={{
            background: darkMode ? '#0f1419' : '#f9fafb',
            border: `1px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`,
            borderRadius: '12px',
            padding: 'clamp(0.75rem, 2vw, 1rem)',
            maxHeight: '300px',
            overflowY: 'auto',
            marginTop: 'clamp(0.5rem, 1vw, 0.75rem)'
          }}>
            <h4 style={{
              margin: '0 0 0.75rem 0',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: darkMode ? '#e8f0ff' : '#1f2937'
            }}>Previous Sessions</h4>
            {chatSessions.length === 0 ? (
              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                color: darkMode ? '#6b7280' : '#9ca3af'
              }}>No previous chats</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {chatSessions.map(session => (
                  <div
                    key={session.id}
                    style={{
                      background: darkMode ? '#1f2d42' : '#ffffff',
                      border: `1px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      padding: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onClick={() => loadChatSession(session.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = darkMode ? '#2a3f5f' : '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = darkMode ? '#1f2d42' : '#ffffff';
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        margin: 0,
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        color: darkMode ? '#e8f0ff' : '#1f2937',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {session.title}
                      </p>
                      <p style={{
                        margin: '0.25rem 0 0 0',
                        fontSize: '0.7rem',
                        color: darkMode ? '#6b7280' : '#9ca3af'
                      }}>
                        {session.messageCount} messages • {session.timestamp}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChatSession(session.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: darkMode ? '#ef4444' : '#dc2626',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Sidebar - Chat History */}
      {showChatHistory && window.innerWidth < 768 && (
        <>
          {/* Overlay backdrop */}
          <div
            onClick={() => setShowChatHistory(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
              animation: 'fadeIn 0.2s ease'
            }}
          />
          {/* Sidebar */}
          <div style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: '280px',
            background: darkMode ? '#0f1419' : '#ffffff',
            borderRight: `1px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInLeft 0.3s ease'
          }}>
            {/* Header */}
            <div style={{
              padding: '1rem',
              borderBottom: `1px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: '700',
                color: darkMode ? '#e8f0ff' : '#1f2937'
              }}>Chat History</h3>
              <button
                onClick={() => setShowChatHistory(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: darkMode ? '#e8f0ff' : '#1f2937',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Sessions List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem'
            }}>
              {chatSessions.length === 0 ? (
                <p style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  color: darkMode ? '#6b7280' : '#9ca3af'
                }}>No previous chats</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {chatSessions.map(session => (
                    <div
                      key={session.id}
                      style={{
                        background: darkMode ? '#1f2d42' : '#f3f4f6',
                        border: `1px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        padding: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '0.5rem'
                      }}
                      onClick={() => loadChatSession(session.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = darkMode ? '#2a3f5f' : '#e5e7eb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = darkMode ? '#1f2d42' : '#f3f4f6';
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          margin: 0,
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          color: darkMode ? '#e8f0ff' : '#1f2937',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {session.title}
                        </p>
                        <p style={{
                          margin: '0.5rem 0 0 0',
                          fontSize: '0.8rem',
                          color: darkMode ? '#6b7280' : '#9ca3af'
                        }}>
                          {session.messageCount} messages
                        </p>
                        <p style={{
                          margin: '0.25rem 0 0 0',
                          fontSize: '0.75rem',
                          color: darkMode ? '#4b5563' : '#d1d5db'
                        }}>
                          {session.timestamp}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChatSession(session.id);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: darkMode ? '#ef4444' : '#dc2626',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Chat Area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: window.innerWidth < 480 ? '0.75rem 0.5rem' : 'clamp(0.5rem, 2vw, 1.25rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: window.innerWidth < 480 ? '0.6rem' : 'clamp(0.5rem, 1.5vw, 1rem)',
          minHeight: 0
        }}
      >
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            padding: 'clamp(0.5rem, 2vw, 1rem)'
          }}>
            <div style={{
              fontSize: 'clamp(2rem, 8vw, 3rem)',
              marginBottom: 'clamp(0.5rem, 2vw, 1rem)'
            }}>💡</div>
            <h3 style={{
              fontSize: 'clamp(1rem, 4vw, 1.3rem)',
              fontWeight: '600',
              color: darkMode ? '#e8f0ff' : '#1f2937',
              margin: '0 0 0.5rem 0'
            }}>Welcome to Q&A</h3>
            <p style={{
              color: darkMode ? '#a8afc7' : '#6b7280',
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
              fontSize: 'clamp(0.8rem, 2vw, 0.95rem)'
            }}>Ask your questions and get instant answers</p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(130px, 35vw, 180px), 1fr))',
              gap: 'clamp(0.5rem, 1.5vw, 0.85rem)',
              width: '100%',
              maxWidth: '800px',
              padding: '0 clamp(0.3rem, 1vw, 0.8rem)'
            }}>
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(q);
                  }}
                  style={{
                    background: darkMode ? '#1f2d42' : '#ffffff',
                    border: `1px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`,
                    color: darkMode ? '#e8f0ff' : '#1f2937',
                    padding: 'clamp(0.6rem, 1.5vw, 0.85rem)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: 'clamp(0.7rem, 1.3vw, 0.85rem)',
                    lineHeight: '1.3',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'clamp(0.3rem, 0.7vw, 0.4rem)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = darkMode ? '#2a3f5f' : '#f3f4f6';
                    e.target.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = darkMode ? '#1f2d42' : '#ffffff';
                    e.target.style.borderColor = darkMode ? '#2a3f5f' : '#e5e7eb';
                  }}
                >
                  <Lightbulb size={16} style={{ marginRight: '0.5rem' }} />
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.who === 'user' ? 'flex-end' : 'flex-start',
                width: '100%',
                animation: 'fadeIn 0.3s ease'
              }}
            >
              <div
                style={{
                  maxWidth: msg.who === 'user' 
                    ? (window.innerWidth < 480 ? '85%' : window.innerWidth < 768 ? '75%' : '70%')
                    : '100%',
                  background: msg.who === 'user'
                    ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                    : darkMode ? '#1f2d42' : '#ffffff',
                  color: msg.who === 'user' ? 'white' : darkMode ? '#e8f0ff' : '#1f2937',
                  padding: window.innerWidth < 480 ? 'clamp(0.6rem, 2vw, 0.8rem)' : '1rem',
                  borderRadius: msg.who === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  boxShadow: msg.who === 'user'
                    ? '0 4px 12px rgba(59, 130, 246, 0.2)'
                    : darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                  border: msg.who === 'bot' ? `1px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}` : 'none',
                  position: 'relative'
                }}
              >
                {msg.image && (
                  <div style={{
                    marginBottom: '0.75rem',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={msg.image}
                      alt="uploaded"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                )}
                <div style={{ fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {msg.who === 'bot' ? renderMessageText(msg.text) : msg.text}
                  {typingMessageId === msg.id && (
                    <span style={{
                      display: 'inline-block',
                      width: '2px',
                      height: '1em',
                      background: darkMode ? '#e8f0ff' : '#1f2937',
                      marginLeft: '4px',
                      animation: 'blink 0.7s infinite'
                    }} />
                  )}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  opacity: 0.6,
                  marginTop: '0.75rem',
                  color: msg.who === 'user' ? 'rgba(255,255,255,0.7)' : darkMode ? '#6b7280' : '#9ca3af'
                }}>
                  {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {msg.who === 'bot' && (
                  <button
                    onClick={() => copyToClipboard(msg.text, msg.id)}
                    style={{
                      position: 'absolute',
                      bottom: '0.5rem',
                      right: '0.5rem',
                      background: 'rgba(0,0,0,0.1)',
                      border: 'none',
                      color: 'inherit',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.background = 'rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '0';
                      e.target.style.background = 'rgba(0,0,0,0.1)';
                    }}
                  >
                    {copied[msg.id] ? '✓' : '📋'} {copied[msg.id] ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
            <div style={{
              background: darkMode ? '#1f2d42' : '#ffffff',
              padding: window.innerWidth < 480 ? '0.5rem' : 'clamp(0.6rem, 1.5vw, 0.85rem)',
              borderRadius: window.innerWidth < 480 ? '10px' : '16px',
              display: 'flex',
              alignItems: 'center',
              gap: window.innerWidth < 480 ? '0.25rem' : 'clamp(0.3rem, 0.8vw, 0.4rem)'
            }}>
              <RefreshCw size={14} style={{
                color: '#3b82f6',
                animation: 'spin 1s linear infinite'
              }} />
              <span style={{ color: darkMode ? '#a8afc7' : '#6b7280', fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)' }}>Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{
        borderTop: `1px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`,
        background: darkMode ? '#151a33' : '#ffffff',
        padding: window.innerWidth < 480 ? '0.65rem 0.5rem' : 'clamp(0.5rem, 2vw, 1.1rem)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: window.innerWidth < 480 ? '0.4rem' : 'clamp(0.3rem, 1vw, 0.6rem)',
        marginTop: 0
      }}>
        {pendingImage && (
          <div style={{
            marginBottom: 'clamp(0.3rem, 1vw, 0.6rem)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(0.5rem, 1.2vw, 0.75rem)',
            background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
            padding: 'clamp(0.4rem, 1vw, 0.65rem) clamp(0.6rem, 1.5vw, 0.9rem)',
            borderRadius: '8px',
            border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`
          }}>
            <img
              src={pendingImage.dataUrl}
              alt="preview"
              style={{
                width: 'clamp(40px, 9vw, 55px)',
                height: 'clamp(40px, 9vw, 55px)',
                objectFit: 'cover',
                borderRadius: '6px',
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', fontWeight: '600', color: darkMode ? '#e8f0ff' : '#1f2937' }}>
                {pendingImage.name}
              </div>
              <div style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: darkMode ? '#a8afc7' : '#6b7280' }}>
                Image attached
              </div>
            </div>
            <button
              onClick={() => setPendingImage(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: darkMode ? '#e8f0ff' : '#374151',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: 'clamp(0.3rem, 1vw, 0.6rem)',
          alignItems: 'center',
          flexWrap: 'wrap',
          margin: 0
        }}>
          <button
            onClick={toggleVoice}
            title={listening ? 'Stop listening' : 'Start voice input'}
            style={{
              background: listening ? '#ef4444' : darkMode ? '#1f2d42' : '#f3f4f6',
              border: `1px solid ${listening ? '#dc2626' : darkMode ? '#2a3f5f' : '#e5e7eb'}`,
              color: listening ? 'white' : darkMode ? '#e8f0ff' : '#374151',
              padding: 'clamp(0.4rem, 1vw, 0.55rem) clamp(0.55rem, 1.2vw, 0.75rem)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.3rem, 0.7vw, 0.4rem)',
              transition: 'all 0.2s ease',
              minWidth: 'auto',
              fontSize: 'clamp(0.65rem, 1.3vw, 0.8rem)',
              whiteSpace: 'nowrap',
              height: '44px'
            }}
            onMouseEnter={(e) => {
              if (!listening) {
                e.target.style.background = darkMode ? '#2a3f5f' : '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!listening) {
                e.target.style.background = darkMode ? '#1f2d42' : '#f3f4f6';
              }
            }}
          >
            <Mic size={16} />
            {listening && <span style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.75rem)' }}>Listening...</span>}
          </button>

          <label
            title="Upload image"
            style={{
              background: darkMode ? '#1f2d42' : '#f3f4f6',
              border: `1px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`,
              color: darkMode ? '#e8f0ff' : '#374151',
              padding: 'clamp(0.4rem, 1vw, 0.55rem) clamp(0.55rem, 1.2vw, 0.75rem)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.3rem, 0.7vw, 0.4rem)',
              transition: 'all 0.2s ease',
              fontSize: 'clamp(0.65rem, 1.3vw, 0.8rem)',
              whiteSpace: 'nowrap',
              height: '44px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = darkMode ? '#2a3f5f' : '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = darkMode ? '#1f2d42' : '#f3f4f6';
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageSelect(e.target.files?.[0])}
              style={{ display: 'none' }}
            />
            <ImageIcon 
              size={16} 
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: 'pointer' }}
            />
          </label>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask your question here..."
            style={{
              flex: 1,
              padding: window.innerWidth < 480 ? '0.7rem 0.9rem' : 'clamp(0.5rem, 1vw, 0.7rem) clamp(0.7rem, 1.5vw, 0.9rem)',
              borderRadius: '10px',
              border: `1px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`,
              background: darkMode ? '#0a0e27' : '#f9fafb',
              color: darkMode ? '#e8f0ff' : '#1f2937',
              fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
              resize: 'none',
              maxHeight: '120px',
              minHeight: '44px',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              lineHeight: '1.5'
            }}
            rows={1}
            disabled={loading}
          />

          <button
            onClick={handleSend}
            disabled={loading || (!input.trim() && !pendingImage)}
            style={{
              background: loading || (!input.trim() && !pendingImage)
                ? darkMode ? '#2a3f5f' : '#d1d5db'
                : 'linear-gradient(135deg, #3b82f6, #6366f1)',
              border: 'none',
              color: 'white',
              padding: 'clamp(0.4rem, 1vw, 0.55rem) clamp(0.65rem, 1.5vw, 1rem)',
              borderRadius: '10px',
              cursor: loading || (!input.trim() && !pendingImage) ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: 'clamp(0.65rem, 1.3vw, 0.8rem)',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.25rem, 0.6vw, 0.35rem)',
              transition: 'all 0.2s ease',
              opacity: loading || (!input.trim() && !pendingImage) ? 0.6 : 1,
              height: '44px'
            }}
            onMouseEnter={(e) => {
              if (!loading && (input.trim() || pendingImage)) {
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <SendHorizontal size={16} /> Send
          </button>
        </div>
        <p style={{
          marginTop: 'clamp(0.2rem, 0.7vw, 0.4rem)',
          fontSize: 'clamp(0.6rem, 1vw, 0.7rem)',
          color: darkMode ? '#6b7280' : '#9ca3af',
          margin: 0,
          lineHeight: '1.2'
        }}>
          💡 Tip: Enter to send, Shift+Enter for new line
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

