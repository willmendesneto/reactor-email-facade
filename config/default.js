module.exports = {
  APP_NAME: 'reactor-email',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  SENDGRID_SECRET_KEY: process.env.SENDGRID_SECRET_KEY,
  SENDGRID_URL: process.env.SENDGRID_URL,
  MAILGUN_SECRET_KEY: process.env.MAILGUN_SECRET_KEY,
  MAILGUN_URL: process.env.MAILGUN_URL,
  PORT: process.env.PORT || 3000,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
