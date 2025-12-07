import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Processing login...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const pathname = window.location.pathname;

        if (!code) {
          throw new Error("No authorization code received from OAuth provider");
        }

        // Determine which provider (Google or GitHub)
        let provider = "unknown";
        let endpoint = "";

        if (pathname.includes("google")) {
          provider = "google";
          endpoint = "http://localhost:5000/api/auth/google/callback";
        } else if (pathname.includes("github")) {
          provider = "github";
          endpoint = "http://localhost:5000/api/auth/github/callback";
        }

        setMessage(`Processing ${provider} login...`);

        // Exchange code for token via backend
        const response = await axios.post(endpoint, { code, state });

        if (response.data.token && response.data.user) {
          // Store token and user info
          localStorage.setItem("token", response.data.token);
          localStorage.setItem(
            "mui_current_user",
            JSON.stringify({
              id: response.data.user.id,
              username: response.data.user.username || response.data.user.email,
              email: response.data.user.email,
            })
          );

          // Record login history (stored on backend by the callback endpoint)
          // Frontend also stores a copy for offline access
          const history = JSON.parse(localStorage.getItem("login_history") || "{}");
          const userId = response.data.user.username || response.data.user.email;
          const provider = pathname.includes("google") ? "google" : "github";

          if (!history[userId]) {
            history[userId] = [];
          }

          history[userId].push({
            provider,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          });

          localStorage.setItem("login_history", JSON.stringify(history));

          setMessage("Login successful! Redirecting...");
          setTimeout(() => navigate("/app"), 1000);
        } else {
          throw new Error("Invalid response from authentication server");
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError(err.message || "Authentication failed. Please try again.");
        setMessage(null);
      }
    };

    processOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {error ? (
          <>
            <h2 style={styles.errorTitle}>Authentication Failed</h2>
            <p style={styles.errorMessage}>{error}</p>
            <button
              onClick={() => navigate("/login")}
              style={styles.button}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <div style={styles.spinner}></div>
            <p style={styles.message}>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    minWidth: "300px",
  },
  spinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #007bff",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px",
  },
  message: {
    color: "#666",
    fontSize: "16px",
    marginTop: "20px",
  },
  errorTitle: {
    color: "#d9534f",
    marginBottom: "15px",
  },
  errorMessage: {
    color: "#d9534f",
    marginBottom: "20px",
    fontSize: "14px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s",
  },
};

// Add keyframe animation
const style = document.createElement("style");
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
