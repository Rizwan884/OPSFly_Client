require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const notesRouter = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 5001; // Use 5001 to avoid conflict with Vite 5173

// ─── Middleware ───────────────────────────────────────────────────────────────
// In a combined Vercel deployment, CORS is usually not needed for same-origin,
// but we keep it for local dev flexibility.
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
// Note: All routes here are prefixed with /api by vercel.json
app.use('/api/notes', notesRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'OpsFly API Monorepo' }));

// ─── Database Connection ──────────────────────────────────────────────────────
let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI missing');
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};

// Middleware to ensure DB connection on every request (standard for serverless)
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// ─── Startup (Local Only) ──────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Local backend running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
