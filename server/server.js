const path = require('path');
const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 8080;

// ─── Serve React Frontend Build ─────────────────────
app.use(require('express').static(path.join(__dirname, '../client/dist')));

// ─── Catch-All: Serve React index.html for client-side routing ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
