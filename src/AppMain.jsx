import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./AppNew.css";
import "./styles/Modules.css";
import "./styles/Auth.css";
import {
  LogIn, LogOut, Menu, X
} from "lucide-react";
import SmartServicesModule from "./SmartServicesModule.jsx";
import GeneralQAModule from "./modules/GeneralQAModule.jsx";
import EducationModule from "./modules/EducationModule.jsx";
import HealthcareModule from "./modules/HealthcareModule.jsx";
import ProductivityModule from "./modules/ProductivityModule.jsx";
import EntertainmentModule from "./modules/EntertainmentModule.jsx";
import InfoModule from "./modules/InfoModule.jsx";

const LS_CURRENT = "mui_current_user";

const uid = () => Math.random().toString(36).slice(2, 9);
const nowISO = () => new Date().toISOString();

const injectCSS = () => {
  const css = `.dark-mode { background: #0f1720; color: #eef2ff; }
  .light-mode { background: #f8f9fa; color: #111827; }
  .dark-mode .dark-mode-text { color: #ffffff !important; }
  .light-mode .dark-mode-text { color: #000000 !important; }
  .chat-bubble.user { background: #0d6efd; color: white; border-radius: 12px; padding: 12px; }
  .chat-bubble.bot { background: rgba(255,255,255,0.9); color: #111827; border-radius: 12px; padding: 12px; }
  .chat-scroll { max-height: 62vh; overflow:auto; padding-bottom: 8px; }
  .sidebar-btn { justify-content: start; }`;
  if (!document.getElementById("mui-inline-css")) {
    const s = document.createElement("style"); s.id = "mui-inline-css"; s.innerText = css; document.head.appendChild(s);
  }
};

export default function AppMain({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  injectCSS();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_CURRENT);
      const parsed = stored ? JSON.parse(stored) : null;
      console.log('[DEBUG] Initial currentUser load from localStorage:', { stored: !!stored, parsed });
      if (parsed) {
        console.log('[DEBUG] Found user:', parsed.username);
      }
      return parsed;
    } catch (err) {
      console.error('[DEBUG] Error parsing localStorage:', err);
      return null;
    }
  });

  // Redirect to home if not logged in
  useEffect(() => {
    if (!currentUser) {
      console.log('[DEBUG] No currentUser, redirecting to home');
      navigate("/");
    } else {
      console.log('[DEBUG] currentUser is set:', currentUser.username);
    }
  }, [currentUser, navigate]);

  // Listen for storage changes (when user logs in from another tab/window or LoginPage)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === LS_CURRENT) {
        try {
          const newUser = e.newValue ? JSON.parse(e.newValue) : null;
          setCurrentUser(newUser);
        } catch {
          setCurrentUser(null);
        }
      }
    };

    // Listen for custom userLoggedIn event
    const handleUserLoggedIn = (e) => {
      console.log('[DEBUG] userLoggedIn event received:', e.detail);
      setCurrentUser(e.detail);
    };

    // Also check periodically for changes since storage event might not fire in same window
    const checkUserStorage = () => {
      try {
        const stored = localStorage.getItem(LS_CURRENT);
        if (stored) {
          const storedUser = JSON.parse(stored);
          if (!currentUser || storedUser.username !== currentUser.username) {
            console.log('[DEBUG] User detected in storage:', storedUser.username);
            setCurrentUser(storedUser);
          }
        }
      } catch {
        // Ignore errors
      }
    };

    // Check immediately on mount
    checkUserStorage();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    const timer = setInterval(checkUserStorage, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
      clearInterval(timer);
    };
  }, []);

  const [active, setActive] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState(null);
  const [listening, setListening] = useState(false);
  const recogRef = useRef(null);
  const scrollRef = useRef();

  useEffect(() => {
    if (currentUser) {
      console.log('[DEBUG] Saving currentUser to localStorage:', currentUser);
      localStorage.setItem(LS_CURRENT, JSON.stringify(currentUser));
    } else {
      console.log('[DEBUG] Removing currentUser from localStorage');
      localStorage.removeItem(LS_CURRENT);
      setMessages([]);
    }
  }, [currentUser]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) { el.scrollTop = el.scrollHeight; }
  }, [messages]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = "en-US";
    r.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setInput(prev => (prev ? prev + " " + t : t));
    };
    r.onend = () => setListening(false);
    recogRef.current = r;
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("mui_current_user");
    setCurrentUser(null);
    setMessages([]);
    navigate("/");
  };

  const handleSend = async () => {
    if (!input.trim() && !pendingImage) return;
    
    // Add user message to chat
    const userMsg = { id: uid(), who: 'user', text: input || "Image sent", image: pendingImage?.dataUrl, time: nowISO() };
    setMessages(prev => [...prev, userMsg]);
    
    try {
      let reply;
      
      if (pendingImage) {
        // For image, send to backend
        const formData = new FormData();
        formData.append('image', pendingImage.dataUrl);
        formData.append('question', input || "What's in this image?");
        
        const response = await axios.post("https://multi-utility-ai-chatbot-1.onrender.com/api/chat/image", formData, {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        reply = response.data.reply;
        setPendingImage(null);
      } else if (input.trim()) {
        // For text, send to backend
        const response = await axios.post("https://multi-utility-ai-chatbot-1.onrender.com/api/chat", 
          { message: input },
          { headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` } }
        );
        reply = response.data.reply;
      }
      
      // Add bot reply
      if (reply) {
        const botMsg = { id: uid(), who: 'bot', text: reply, time: nowISO() };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = { id: uid(), who: 'bot', text: "Sorry, I encountered an error. Please try again.", time: nowISO() };
      setMessages(prev => [...prev, errorMsg]);
    }
    
    setInput("");
  };

  const clearChat = () => {
    if (!window.confirm("Clear chat?")) return;
    setMessages([]);
  };

  const handleImageSelect = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPendingImage({
        file, name: file.name, size: file.size, type: file.type, dataUrl: e.target.result
      });
    };
    reader.readAsDataURL(file);
  };

  const toggleVoice = () => {
    if (!recogRef.current) return;
    if (listening) {
      recogRef.current.stop();
      setListening(false);
    } else {
      recogRef.current.start();
      setListening(true);
    }
  };

  const getModuleTitle = () => {
    const titles = {
      chat: "AI Chat",
      education: "Education Hub",
      healthcare: "Health & Wellness",
      productivity: "Productivity",
      entertainment: "Entertainment",
      services: "Developer Tools",
      info: "Profile",
      settings: "Settings",
      auth: "Login"
    };
    return titles[active] || "Menu";
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"} ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* Professional Top Navbar */}
      <nav className="app-navbar">
        <div className="navbar-left">
          <button 
            className="navbar-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Close Menu" : "Open Menu"}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="navbar-title">{getModuleTitle()}</span>
        </div>
        
        <div className="navbar-right">
          {currentUser ? (
            <button
              className="navbar-logout-btn"
              onClick={() => { setCurrentUser(null); setMessages([]); setActive("auth"); handleLogout(); }}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          ) : (
            <button
              className="navbar-login-btn"
              onClick={() => navigate("/login")}
            >
              <LogIn size={18} /> Login
            </button>
          )}
        </div>
      </nav>

      {/* Main Layout - Sidebar + Content */}
      <div className="app-main">
        {/* Sidebar Navigation - Vertical Module Menu */}
        <aside className={`app-sidebar-new ${sidebarOpen ? "mobile-open" : ""}`}>
          {/* Close Button */}
          <button 
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            title="Close Menu"
          >
            <X size={24} />
          </button>

          <nav className="sidebar-nav-new">
            <div className="sidebar-modules">
              <button
                className={`module-nav-btn ${active === "chat" ? "active" : ""}`}
                onClick={() => { setActive("chat"); setSidebarOpen(false); }}
                title="Chat"
              >
                <span className="module-icon">💬</span>
                <span className="module-label">Chat</span>
              </button>

              <button
                className={`module-nav-btn ${active === "education" ? "active" : ""}`}
                onClick={() => { setActive("education"); setSidebarOpen(false); }}
                title="Education"
              >
                <span className="module-icon">📚</span>
                <span className="module-label">Education</span>
              </button>

              <button
                className={`module-nav-btn ${active === "healthcare" ? "active" : ""}`}
                onClick={() => { setActive("healthcare"); setSidebarOpen(false); }}
                title="Health"
              >
                <span className="module-icon">❤️</span>
                <span className="module-label">Health</span>
              </button>

              <button
                className={`module-nav-btn ${active === "productivity" ? "active" : ""}`}
                onClick={() => { setActive("productivity"); setSidebarOpen(false); }}
                title="Productivity"
              >
                <span className="module-icon">⚡</span>
                <span className="module-label">Work</span>
              </button>

              <button
                className={`module-nav-btn ${active === "entertainment" ? "active" : ""}`}
                onClick={() => { setActive("entertainment"); setSidebarOpen(false); }}
                title="Entertainment"
              >
                <span className="module-icon">🎮</span>
                <span className="module-label">Fun</span>
              </button>

              <button
                className={`module-nav-btn ${active === "services" ? "active" : ""}`}
                onClick={() => { setActive("services"); setSidebarOpen(false); }}
                title="Tools"
              >
                <span className="module-icon">🛠️</span>
                <span className="module-label">Tools</span>
              </button>

              <div className="sidebar-divider"></div>

              <button
                className={`module-nav-btn ${active === "settings" ? "active" : ""}`}
                onClick={() => { setActive("settings"); setSidebarOpen(false); }}
                title="Settings"
              >
                <span className="module-icon">⚙️</span>
                <span className="module-label">Settings</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content Area */}
        <main className="app-content">
          {/* Chat Module */}
          {active === "chat" && (
            <div className="content-view chat-view">
              <GeneralQAModule
                messages={messages}
                setMessages={setMessages}
                currentUser={currentUser}
                scrollRef={scrollRef}
                input={input}
                setInput={setInput}
                pendingImage={pendingImage}
                setPendingImage={setPendingImage}
                listening={listening}
                toggleVoice={toggleVoice}
                handleImageSelect={handleImageSelect}
                handleSend={handleSend}
                clearChat={clearChat}
                darkMode={darkMode}
              />
            </div>
          )}

          {/* Education Module */}
          {active === "education" && (
            <div className="content-view">
              <EducationModule darkMode={darkMode} />
            </div>
          )}

          {/* Healthcare Module */}
          {active === "healthcare" && (
            <div className="content-view">
              <HealthcareModule darkMode={darkMode} />
            </div>
          )}

          {/* Productivity Module */}
          {active === "productivity" && (
            <div className="content-view">
              <ProductivityModule darkMode={darkMode} />
            </div>
          )}

          {/* Entertainment Module */}
          {active === "entertainment" && (
            <div className="content-view">
              <EntertainmentModule darkMode={darkMode} />
            </div>
          )}

          {/* Smart Services Module */}
          {active === "services" && (
            <div className="content-view">
              <SmartServicesModule darkMode={darkMode} />
            </div>
          )}

          {/* Info/Profile Module */}
          {active === "info" && (
            <div className="content-view">
              <InfoModule darkMode={darkMode} />
            </div>
          )}

          {/* Settings Module */}
          {active === "settings" && (
            <div className="content-view settings-view">
              <div className="view-header">
                <h1>Settings</h1>
              </div>
              <div className="view-content">
                <div className="settings-section">
                  <h2>Appearance</h2>
                  <div className="setting-item">
                    <label>Dark Mode</label>
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={() => setDarkMode(d => !d)}
                    />
                  </div>
                </div>
                <div className="settings-section">
                  <h2>About</h2>
                  <p>AI Multi-Utility Assistant v1.0</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
