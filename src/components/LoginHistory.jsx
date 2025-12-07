import React, { useState, useEffect } from "react";
import { LogOut, Calendar, Globe } from "lucide-react";
import { getLoginHistory, formatLoginEntry } from "../utils/historyTracker";
import "../styles/LoginHistory.css";

export default function LoginHistory({ username }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      const userHistory = getLoginHistory(username);
      setHistory(userHistory);
      setLoading(false);
    }
  }, [username]);

  if (loading) {
    return <div className="history-container">Loading history...</div>;
  }

  if (!history || history.length === 0) {
    return (
      <div className="history-container">
        <p className="history-empty">No login history available</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h3>🔐 Login History</h3>
        <p className="history-subtitle">Your recent login activities ({history.length})</p>
      </div>

      <div className="history-list">
        {history.map((entry, index) => (
          <div key={index} className="history-item">
            <div className="history-item-left">
              <div className="history-provider">
                {entry.provider === "google" && <span className="provider-icon">🔵</span>}
                {entry.provider === "github" && <span className="provider-icon">⚫</span>}
                {entry.provider === "email" && <span className="provider-icon">📧</span>}
              </div>
            </div>

            <div className="history-item-center">
              <div className="history-provider-name">
                {entry.provider.toUpperCase()} Login
              </div>
              <div className="history-timestamp">
                <Calendar size={14} />
                {entry.date}
              </div>
            </div>

            <div className="history-item-right">
              <span className="history-badge">
                {index === 0 ? "Latest" : `${index}d ago`}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="history-footer">
        <Globe size={14} />
        <p>You can log in from any device with any of these providers</p>
      </div>
    </div>
  );
}
