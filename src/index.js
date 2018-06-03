require('dotenv-safe').config({ allowEmptyValues: true });

const conf = require('config');
const logger = require('./core/logger')();
const app = require('./app');

const port = conf.get('PORT');

const server = app.listen(port, () => {
  const gracefulShutdown = () => {
    logger.info('Received kill signal, shutting down gracefully.');
    server.close(() => {
      logger.info('Closing remaining connections.');
      process.exit();
    });

    setTimeout(() => {
      logger.error('Unable to close all connections, forcefully terminating.');
      process.exit();
    }, 10 * 1000);
  };

  // for CTRL-C
  process.on('SIGINT', gracefulShutdown);

  // for kill signal
  process.on('SIGTERM', gracefulShutdown);

  process.on('uncaughtException', (error) => {
    logger.error('An unhandled exception occured.', error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(
      'An unhandled promise rejection at',
      promise,
      `Reason: ${reason}`,
    );
  });

  logger.info(`Listening on port http://localhost:${server.address().port}`);
});
