const BaseJoi = require('joi');
const isHtml = require('is-html');

const Joi = BaseJoi.extend((joi) => ({
  base: joi.string(),
  name: 'string',
  language: {
    round: 'needs to be a text without html elements',
  },
  rules: [
    {
      name: 'isAValidText',
      validate(params, value, state, options) {
        const isAValidText = !isHtml(value);
        if (!isAValidText) {
          return this.createError(
            'string.isAValidText',
            { v: value },
            state,
            options,
          );
        }
        return isAValidText;
      },
    },
  ],
}));

const runValidation = (obj, joiSchema) => {
  const { error } = Joi.validate(obj, joiSchema);
  return { valid: error === null, error: error === null ? '' : error.message };
};

const EMAIL_REQUIRED = Joi.string()
  .email()
  .required();

const EMAIL_LIST = [
  EMAIL_REQUIRED,
  Joi.array()
    .unique()
    .items(EMAIL_REQUIRED),
];

const BASE_EMAIL_SCHEMA = Joi.object().keys({
  to: EMAIL_LIST,
  cc: EMAIL_LIST,
  bcc: EMAIL_LIST,
  from: Joi.string()
    .email()
    .required(),
  text: Joi.string()
    .required()
    .isAValidText(),
  subject: Joi.string()
    .required()
    .isAValidText(),
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
