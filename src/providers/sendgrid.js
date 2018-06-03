const fetch = require('node-fetch');
const { schemas, runValidation } = require('../schemas');

const configureEmailProvider = ({
  logger,
  name = 'sendgrid',
  sendgridUrl,
  sendgridSecretKey,
}) => {
  const validationResult = runValidation(
    {
      logger,
      name,
      emailServiceUrl: sendgridUrl,
      emailServiceSecretKey: sendgridSecretKey,
    },
    schemas.EMAIL_SERVICE,
  );

  if (!validationResult.valid) {
    throw new Error(
      `Sendgrid Error: Invalid information: ${validationResult.error}`,
    );
  }

  const sendMessageToTarget = async (message) => {
    try {
      const url = `${sendgridUrl}/v3/mail/send`;

      const options = {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sendgridSecretKey}`,
        },
      };

      logger.info(
        `Sendgrid API: Starting request. Options: ${JSON.stringify(options)}`,
      );

      const response = await fetch(url, options);
      if (!response.ok) {
        logger.error(`Sendgrid API returned '${response.status}' for '${url}'`);
      }
      return response.ok && response.status === 202;
    } catch (error) {
      logger.error(error);
    }

    return false;
  };

  const formatDataToProvider = ({ from, text, subject, ...data }) => {
    const multipleOptionalItems = Object.keys(data)
      .filter((key) => ['to', 'cc', 'bcc'].includes(key))
      .reduce(
        (value, key) => ({
          ...value,
          [key]: [].concat(data[key]).map((email) => ({ email })),
        }),
        {},
      );

    return {
      personalizations: [{ ...multipleOptionalItems, subject }],
      from: { email: from },
      content: [{ type: 'type/plain', value: text }],
    };
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
