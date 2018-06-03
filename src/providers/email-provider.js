const conf = require('config');
const logger = require('../core/logger')();

const mailgunProvider = require('./mailgun');
const sendgridProvider = require('./sendgrid');

const emailProviders = [];

const sendEmailByFirstProviderAvailable = async (data) => {
  let success = false;

  /* eslint-disable */
  for (const emailProvider of emailProviders) {
    logger.info(`Trying send the email using '${emailProvider.name}'.`);
    success = await emailProvider.send(data);

    if (success) {
      logger.info(`'${emailProvider.name}' was able to send the email!`);
      break;
    }

    logger.info(`'${emailProvider.name}' had a bad time sending the email.`);
  }
  /* eslint-enable */

  return success;
};

const configureProvider = () => {
  if (!emailProviders.length) {
    logger.info('Starting the email providers');

    emailProviders.push(
      mailgunProvider({
        logger,
        mailgunUrl: conf.get('MAILGUN_URL'),
        mailgunSecretKey: conf.get('MAILGUN_SECRET_KEY'),
      }),
      sendgridProvider({
        logger,
        sendgridUrl: conf.get('SENDGRID_URL'),
        sendgridSecretKey: conf.get('SENDGRID_SECRET_KEY'),
      }),
    );
  }

  return { sendEmailByFirstProviderAvailable };
};

module.exports = configureProvider;
