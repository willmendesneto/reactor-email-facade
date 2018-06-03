const fetch = require('node-fetch');
const FormData = require('form-data');

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
    const url = `${mailgunUrl}/messages`;

    const formData = new FormData();
    Object.keys(message).forEach((key) => formData.append(key, message[key]));

    const options = {
      body: formData,
      method: 'POST',
      headers: {
        ...formData.getHeaders(),
        Authorization: `Basic ${buildAuthKey(mailgunSecretKey)}`,
      },
    };

    try {
      const response = await fetch(url, options, formData.getHeaders());
      if (!response.ok) {
        logger.error(`Mailgun API returned '${response.status}' for '${url}'`);
      }

      return response.ok && response.status === 200;
    } catch (error) {
      logger.error(error);
    }

    return false;
  };

  const formatDataToProvider = (data) => data;

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
