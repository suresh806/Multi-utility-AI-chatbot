const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

// Proxy API requests to Flask backend FIRST (before static files)
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000/api',
  changeOrigin: true
}));

// Serve static files from build folder
app.use(express.static(path.join(__dirname, 'build')));

// Serve index.html for all other routes (SPA routing)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`✅ API proxy: /api/* -> http://localhost:5000`);
});
