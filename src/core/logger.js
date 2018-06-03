const pino = require('pino');
const conf = require('config');

let logger;

module.exports = () => {
  if (!logger) {
    logger = pino({
      level: conf.get('LOG_LEVEL'),
      name: 'reactor-email',
      safe: true,
      serializers: {
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
      },
    });
  }

  return logger;
};
