const config = require('./src/config');
const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});
