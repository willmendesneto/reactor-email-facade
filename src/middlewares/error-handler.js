const conf = require('config');
const logger = require('../core/logger')();

module.exports = function errorHandler(err, req, res, next) {
  const responseObj = {};

  logger.error(err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.status && err.status >= 400 && err.status < 500) {
    res.status(err.status);
  } else {
    res.status(500);
    responseObj.message = 'Internal Server Error';
  }

  if (!conf.get('IS_PRODUCTION')) {
    responseObj.stack = err.stack || err;
  }

  return res.json(responseObj);
};
