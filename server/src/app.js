const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Route imports
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const teamRoutes = require('./routes/teamRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// ─── Security ────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

// ─── Rate Limiting ───────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// ─── Body Parsing ────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Request Logging ─────────────────────────────────
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.originalUrl}`);
  next();
});

// ─── Health Check ────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Team Task Manager API is running.' });
});

// ─── API Routes ──────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', teamRoutes); // team routes mounted under /api/projects/:id/members
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
// ─── Serve React Frontend Build ─────────────────────
const path = require('path');
const fs = require('fs');

// Try every possible location for client/dist
const candidates = [
  path.join(process.cwd(), 'client', 'dist'),
  path.join(__dirname, '..', '..', 'client', 'dist'),
  path.join(__dirname, '..', 'client', 'dist'),
  path.join(process.cwd(), '..', 'client', 'dist'),
  path.resolve('client', 'dist'),
  path.resolve('..', 'client', 'dist'),
];

let clientDist = null;
for (const p of candidates) {
  console.log('[PATH CHECK]', p, '->', fs.existsSync(p));
  if (fs.existsSync(path.join(p, 'index.html'))) {
    clientDist = p;
    break;
  }
}

console.log('[RESOLVED] clientDist:', clientDist || 'NOT FOUND');

if (clientDist) {
  app.use(express.static(clientDist));
}

// ─── Catch-All ───────────────────────────────────────
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
  }
  if (clientDist) {
    return res.sendFile(path.join(clientDist, 'index.html'));
  }
  res.status(503).json({ success: false, message: 'Frontend not found. Checked: ' + candidates.join(', ') });
});

// ─── Global Error Handler ────────────────────────────
app.use(errorHandler);

module.exports = app;
