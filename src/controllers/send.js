const { runValidation, schemas } = require('../schemas');
const {
  sendEmailByFirstProviderAvailable,
} = require('../providers/email-provider')();

const sendController = async (req, res) => {
  const data = {
    message: 'Your email will be delivered in the next minutes. Thank you!',
  };
  let statusCode = 201;

  const validationResult = runValidation(req.body, schemas.BASE_EMAIL_SCHEMA);

  if (!validationResult.valid) {
    statusCode = 400;
    data.message = `Invalid information: ${validationResult.error}`;
    req.logger.error(data);
    return res.status(statusCode).send(data);
  }

  const success = await sendEmailByFirstProviderAvailable(req.body);

  if (!success) {
    statusCode = 500;
    data.message =
      "Houston, we're having some problems and your email was not delivered. Try again later";
  }
  req.logger.error(data);
  return res.status(statusCode).send(data);
};

module.exports = sendController;
