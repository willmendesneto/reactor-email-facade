const fetch = require('node-fetch');
const querystring = require('querystring');

const { schemas, runValidation } = require('../schemas');

const configureEmailProvider = ({
  logger,
  name = 'mailgun',
  mailgunUrl,
  mailgunSecretKey,
}) => {
  const validationResult = runValidation(
    {
      logger,
      name,
      emailServiceUrl: mailgunUrl,
      emailServiceSecretKey: mailgunSecretKey,
    },
    schemas.EMAIL_SERVICE,
  );

  if (!validationResult.valid) {
    throw new Error(
      `Mailgun Error: Invalid information: ${validationResult.error}`,
    );
  }

  const buildAuthKey = (key) => Buffer.from(`api:${key}`).toString('base64');

  const sendMessageToTarget = async (message) => {
    try {
      const url = `${mailgunUrl}/messages`;

      const options = {
        body: querystring.stringify(message),
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${buildAuthKey(mailgunSecretKey)}`,
        },
      };

      logger.info(
        `Mailgun API: Starting request. Options: ${JSON.stringify(options)}`,
      );

      const response = await fetch(url, options);
      if (!response.ok) {
        logger.error(`Mailgun API returned '${response.status}' for '${url}'`);
      }
      return response.ok && response.status === 200;
    } catch (error) {
      logger.error(error);
    }

    return false;
  };

  const formatDataToProvider = ({ from, text, subject, ...data }) => {
    const multipleOptionalItems = Object.keys(data)
      .filter((key) => ['to', 'bcc', 'cc'].includes(key))
      .reduce(
        (value, key) => ({
          ...value,
          [key]: [].concat(data[key]).join(','),
        }),
        {},
      );

    const formattedData = {
      from,
      text,
      subject,
      ...multipleOptionalItems,
    };

    return formattedData;
  };

  const send = async (data) => {
    try {
      const formattedData = formatDataToProvider(data);
      const message = await sendMessageToTarget(formattedData);
      return message;
    } catch (error) {
      logger.error(error);
    }
    return false;
  };

  return {
    send,
    name,
  };
};

module.exports = configureEmailProvider;
