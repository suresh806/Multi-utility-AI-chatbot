import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { recordLoginHistory } from "../utils/historyTracker";
import "../styles/Auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://multi-utility-ai-chatbot-1.onrender.com/api/auth/login", {
        username: formData.username.toLowerCase(),
        password: formData.password
      });

      console.log('[DEBUG] Login successful, response:', response.data);

      localStorage.setItem("token", response.data.token);
      const userData = {
        username: response.data.username,
        email: response.data.email || `${response.data.username}@smartservices.ai`
      };
      console.log('[DEBUG] Setting user data:', userData);
      localStorage.setItem("mui_current_user", JSON.stringify(userData));

      // Verify it was stored
      const stored = localStorage.getItem("mui_current_user");
      console.log('[DEBUG] Verified stored data:', stored);

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userData }));
      console.log('[DEBUG] Dispatched userLoggedIn event');

      // Record login history for email login
      recordLoginHistory(response.data.username, "email", new Date());

      // Add small delay to ensure storage is written
      setTimeout(() => {
        console.log('[DEBUG] Navigating to /app');
        navigate("/app");
      }, 100);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Mail size={32} color="white" />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username or Email</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-auth primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <a href="#" onClick={() => navigate("/register")}>Sign up</a>
        </p>
      </div>
    </div>
  );
}
