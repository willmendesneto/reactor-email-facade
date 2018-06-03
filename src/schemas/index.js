const Joi = require('joi');

const runValidation = (obj, joiSchema) => {
  const { error } = Joi.validate(obj, joiSchema);
  return { valid: error === null, error: error === null ? '' : error.message };
};

const BASE_EMAIL_SCHEMA = Joi.object().keys({
  to: Joi.string()
    .email()
    .required(),
  from: Joi.string()
    .email()
    .required(),
  text: Joi.string().required(),
  subject: Joi.string().required(),
});

const EMAIL_SERVICE = Joi.object().keys({
  logger: Joi.any().required(),
  emailServiceUrl: Joi.string().required(),
  emailServiceSecretKey: Joi.string().required(),
  name: Joi.string().required(),
});

module.exports = {
  schemas: {
    BASE_EMAIL_SCHEMA,
    EMAIL_SERVICE,
  },
  runValidation,
};
