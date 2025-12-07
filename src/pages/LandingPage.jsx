import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Users,
  TrendingUp,
  Cpu,
  Moon,
  Sun,
  Check,
  ChevronDown,
  ChevronUp,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import "../styles/LandingPage.css";
import AIImage from "./AIimage.jpg";

export default function LandingPage({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("mui_current_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Sync currentUser state when component mounts or when returning from login
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem("mui_current_user");
        setCurrentUser(stored ? JSON.parse(stored) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mui_current_user");
    setCurrentUser(null);
    setMobileMenuOpen(false);
  };

  const stats = [
    { label: "Active Users", value: "10M+", icon: Users },
    { label: "Daily Interactions", value: "50M+", icon: TrendingUp },
    { label: "Countries", value: "150+", icon: Cpu },
    { label: "Uptime", value: "99.9%", icon: Users },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get instant AI responses with our optimized infrastructure and cutting-edge models",
    },
    {
      icon: Shield,
      title: "100% Secure",
      description: "Your data is encrypted and protected with enterprise-grade security standards",
    },
    {
      icon: Globe,
      title: "Available Everywhere",
      description: "Access SmartServices AI from any device, anytime, anywhere in the world",
    },
    {
      icon: Smartphone,
      title: "Works on All Devices",
      description: "Seamlessly use on desktop, tablet, or mobile with our fully responsive interface",
    },
  ];

  const faqs = [
    {
      question: "Is SmartServices AI really free?",
      answer: "Yes! Completely free forever. All features and modules are available at no cost. No hidden charges, no premium upgrades required.",
    },
    {
      question: "Do I need to provide a credit card to start?",
      answer: "No, absolutely not. You can use SmartServices AI without any credit card or payment information. Just sign up and start using.",
    },
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
    },
    {
      question: "How is my data protected?",
      answer: "We use enterprise-grade encryption and comply with international data protection standards. Your privacy is our priority.",
    },
    {
      question: "Is there a mobile app?",
      answer: "Our web app is fully responsive and works great on mobile. Native apps for iOS and Android are coming soon!",
    },
  ];

  return (
    <div className={`landing-page ${!darkMode ? "light-mode" : ""}`}>
      {/* Navigation */}
      <nav className="landing-navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <Cpu size={28} color="#00d4ff" />
            <span>SmartServices AI</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="navbar-links desktop-only">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#stats" className="nav-link">
              Stats
            </a>
            <button 
              className="nav-btn login-btn" 
              onClick={() => setDarkMode(!darkMode)}
              style={{ marginRight: "0.5rem" }}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {currentUser ? (
              <button className="nav-btn login-btn logout-btn" onClick={handleLogout} title="Logout">
                <LogOut size={18} />
              </button>
            ) : (
              <>
                <button className="nav-btn login-btn" onClick={() => navigate("/login")}>
                  Login
                </button>
                <button className="nav-btn signup-btn" onClick={() => navigate("/register")}>
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="navbar-mobile-controls">
            <button 
              className="nav-btn login-btn" 
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <a href="#features" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                Features
              </a>
              <a href="#stats" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                Stats
              </a>
              {currentUser ? (
                <button className="mobile-menu-link logout-btn" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  <LogOut size={16} /> Logout
                </button>
              ) : (
                <>
                  <button className="mobile-menu-link login-link" onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}>
                    Login
                  </button>
                  <button className="mobile-menu-link signup-link" onClick={() => { navigate("/register"); setMobileMenuOpen(false); }}>
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">✨ AI-Powered Platform for Everyone</div>
            <h1 className="hero-title">
              Your Personal AI <span className="gradient-text">Assistant</span>
            </h1>
            <p className="hero-subtitle">
              Chat, learn, stay healthy, boost productivity, have fun, and access powerful tools
              - all in one intelligent platform
            </p>
            <div className="hero-buttons">
              <button
                className="hero-btn primary-btn"
                onClick={() => {
                  if (currentUser) {
                    navigate("/app");
                  } else {
                    navigate("/register");
                  }
                }}
              >
                Get Started Free <ArrowRight size={18} />
              </button>
            </div>
            <div className="hero-note">✓ No credit card required • ✓ Free forever option available</div>
          </div>
          <div className="hero-visual">
            <img
              src={AIImage}
              alt="AI Smart Services"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" id="stats">
        <div className="stats-container">
          <h2 className="section-title">Trusted by Millions</h2>
          <div className="stats-grid">
            {stats.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div key={idx} className="stat-card">
                  <div
                    className="stat-icon"
                    style={{
                      background: `linear-gradient(135deg, ${
                        ["#00d4ff", "#06d6a0", "#ff006e", "#ffd60a"][idx]
                      }, ${
                        ["#0099ff", "#00a86b", "#e91e63", "#ffb703"][idx]
                      })`,
                    }}
                  >
                    <StatIcon size={28} color="white" />
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="features-container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{ background: "linear-gradient(135deg, #00d4ff, #0099ff)" }}>
                <Cpu size={24} color="white" />
              </div>
              <h3>AI-Powered</h3>
              <p>Cutting-edge artificial intelligence for intelligent responses</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: "linear-gradient(135deg, #06d6a0, #00a86b)" }}>
                <TrendingUp size={24} color="white" />
              </div>
              <h3>Always Learning</h3>
              <p>Continuously improving based on your preferences and feedback</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: "linear-gradient(135deg, #ff006e, #e91e63)" }}>
                <Users size={24} color="white" />
              </div>
              <h3>Premium Experience</h3>
              <p>Beautiful, intuitive interface designed for seamless interaction</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: "linear-gradient(135deg, #ffd60a, #ffb703)" }}>
                <TrendingUp size={24} color="white" />
              </div>
              <h3>24/7 Available</h3>
              <p>Round-the-clock access to all services whenever you need them</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: "linear-gradient(135deg, #a100f2, #7c3aed)" }}>
                <Users size={24} color="white" />
              </div>
              <h3>Community</h3>
              <p>Join millions of users and share experiences with a global community</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: "linear-gradient(135deg, #ff9500, #ff6b35)" }}>
                <TrendingUp size={24} color="white" />
              </div>
              <h3>Fully Customizable</h3>
              <p>Tailor every aspect to match your personal preferences and workflow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section" id="benefits">
        <div className="benefits-container">
          <h2 className="section-title">Why SmartServices AI is the Best Choice</h2>
          <p className="section-subtitle">Completely free, forever. No hidden costs, no upgrades.</p>
          <div className="benefits-grid">
            {benefits.map((benefit, idx) => {
              const BenefitIcon = benefit.icon;
              return (
                <div key={idx} className="benefit-card">
                  <div 
                    className="benefit-icon"
                    style={{
                      background: `linear-gradient(135deg, ${
                        ["#00d4ff", "#06d6a0", "#ff006e", "#ffd60a"][idx]
                      }, ${
                        ["#0099ff", "#00a86b", "#e91e63", "#ffb703"][idx]
                      })`,
                    }}
                  >
                    <BenefitIcon size={28} color="white" />
                  </div>
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-description">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" id="faq">
        <div className="faq-container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                >
                  <span>{faq.question}</span>
                  {expandedFAQ === idx ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                {expandedFAQ === idx && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Get Started?</h2>
          <p>Join millions of users enjoying SmartServices AI completely free, forever</p>
          <div className="cta-content">
            <p className="cta-highlight">✨ No credit card required • No sign-up fees • Instant access</p>
            <p className="cta-description">Navigate to the app using the menu above to start exploring all features immediately. It's that simple!</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-section">
            <h4>SmartServices AI</h4>
            <p>Your personal AI assistant for every aspect of life</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#modules">Modules</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#stats">Pricing</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#terms">Terms</a></li>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <ul>
              <li><a href="#twitter">Twitter</a></li>
              <li><a href="#facebook">Facebook</a></li>
              <li><a href="#linkedin">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 SmartServices AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
