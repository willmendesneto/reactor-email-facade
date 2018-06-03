const express = require('express');
const conf = require('config');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const slash = require('express-slash');
const hpp = require('hpp');
const { name, version } = require('../package.json');
const routes = require('./routes');
const errorHandler = require('./middlewares/error-handler');
const ignoreFavicon = require('./middlewares/ignore-favicon');

const logger = require('./core/logger')();
const expressPinoLogger = require('express-pino-logger')();

// start express
logger.info(`Express Server started ${name}@${version} (PID ${process.pid})`);
const app = express();

// Register common middleware
logger.info('Common middleware registration');
app.use(expressPinoLogger);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

app.use(hpp());
app.use(cookieParser());
app.use(helmet());
app.use(ignoreFavicon);

app.enable('strict routing');
app.enable('case sensitive routing');
logger.info('Enabling of strict and case sensitive complete.');

// Register routes
logger.info('Route registration');

app.use('/v1', routes);

// Register trailing slash check - must come after registering routes.
app.use(slash());

// only handle errors in production. In dev use the default
// Express error handler http://expressjs.com/en/guide/error-handling.html
if (conf.get('IS_PRODUCTION')) {
  app.use(errorHandler);
}

module.exports = app;
