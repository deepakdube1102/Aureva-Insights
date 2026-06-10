const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { clerkMiddleware } = require('@clerk/express');
const path = require('path');
const connectDB = require('./config/db');

// Load repo-root .env (local monorepo); server/.env overrides if present
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Connect to MongoDB
connectDB();

// Middleware — allow local Vite dev + Vercel production (set FRONTEND_URL on Render)
const corsOrigins = [
  'http://localhost:5173',
  ...(process.env.FRONTEND_URL || '')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use('/api/funds', require('./routes/funds'));
app.use('/api/watchlist', require('./routes/watchlist'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  // Clerk auth errors
  if (err.status === 401 || err.statusCode === 401) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS origins: ${corsOrigins.join(', ')}`);
});
