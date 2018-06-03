const pino = require('pino');

let logger;

module.exports = () => {
  if (!logger) {
    logger = pino({
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
