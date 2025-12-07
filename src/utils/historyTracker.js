/**
 * User Login History Tracker
 * Stores and retrieves login history per user using localStorage
 */

/**
 * Record a login event for a user
 * @param {string} userId - User ID or username
 * @param {string} provider - OAuth provider or 'email' ('google', 'github', 'email')
 * @param {Date} timestamp - When the login occurred
 */
export const recordLoginHistory = (userId, provider, timestamp = new Date()) => {
  try {
    const history = JSON.parse(localStorage.getItem("login_history") || "{}");

    if (!history[userId]) {
      history[userId] = [];
    }

    const loginEntry = {
      provider,
      timestamp: timestamp.toISOString(),
      date: timestamp.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      userAgent: navigator.userAgent.substring(0, 100),
    };

    history[userId].push(loginEntry);

    // Keep only last 50 logins per user
    if (history[userId].length > 50) {
      history[userId] = history[userId].slice(-50);
    }

    localStorage.setItem("login_history", JSON.stringify(history));
    return true;
  } catch (err) {
    console.error("Error recording login history:", err);
    return false;
  }
};

/**
 * Get login history for a specific user
 * @param {string} userId - User ID or username
 * @returns {Array} Array of login entries sorted by most recent first
 */
export const getLoginHistory = (userId) => {
  try {
    const history = JSON.parse(localStorage.getItem("login_history") || "{}");
    const userHistory = history[userId] || [];
    return userHistory.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  } catch (err) {
    console.error("Error retrieving login history:", err);
    return [];
  }
};

/**
 * Clear login history for a specific user
 * @param {string} userId - User ID or username
 */
export const clearLoginHistory = (userId) => {
  try {
    const history = JSON.parse(localStorage.getItem("login_history") || "{}");
    delete history[userId];
    localStorage.setItem("login_history", JSON.stringify(history));
    return true;
  } catch (err) {
    console.error("Error clearing login history:", err);
    return false;
  }
};

/**
 * Get all login history (for debugging)
 * @returns {Object} Complete login history object
 */
export const getAllLoginHistory = () => {
  try {
    return JSON.parse(localStorage.getItem("login_history") || "{}");
  } catch (err) {
    console.error("Error retrieving all login history:", err);
    return {};
  }
};

/**
 * Format a login entry for display
 * @param {Object} entry - Login history entry
 * @returns {string} Formatted string
 */
export const formatLoginEntry = (entry) => {
  const providerEmoji = {
    google: "🔵",
    github: "⚫",
    email: "📧",
  };

  const emoji = providerEmoji[entry.provider] || "🔐";
  return `${emoji} ${entry.provider.toUpperCase()} - ${entry.date}`;
};
