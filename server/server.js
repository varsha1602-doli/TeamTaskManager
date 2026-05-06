const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
