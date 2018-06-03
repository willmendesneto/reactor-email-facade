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
    const url = `${sendgridUrl}/v3/mail/send`;

    const options = {
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sendgridSecretKey}`,
      },
    };

    try {
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

  const formatDataToProvider = (data) => ({
    from: { email: data.from },
    subject: data.subject,
    content: [{ type: 'type/plain', value: data.text }],
    personalizations: Object.keys(data)
      .filter((key) => ['to', 'cc', 'bcc'].includes(key))
      .map((key) => ({ [key]: [{ email: data[key] }] })),
  });

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
