const { schemas, runValidation } = require('../../../src/schemas');

describe('Schemas', () => {
  describe('BASE_EMAIL_SCHEMA', () => {
    const message = {
      to: 'anothertest@inexistentdomain.com',
      from: 'test@inexistentdomain.com',
      text: 'Hello world',
      subject: 'This is a test',
    };

    it('validation should pass for valid object shapes', () => {
      const validationResult = runValidation(
        message,
        schemas.BASE_EMAIL_SCHEMA,
      );
      expect(validationResult.valid).to.eql(true);
      expect(validationResult.error === '').to.eql(true);
    });

    it('validation should fail for invalid object shapes', () => {
      const malformedMessage = { ...message, text: undefined };
      const validationResult = runValidation(
        malformedMessage,
        schemas.BASE_EMAIL_SCHEMA,
      );
      expect(validationResult.valid).to.eql(false);
      expect(validationResult.error === '').to.eql(false);
    });
  });

  describe('EMAIL_SERVICE', () => {
    const message = {
      logger: { info: () => null },
      emailServiceUrl: 'https://email-url-service.dummy.com',
      emailServiceSecretKey: 'hdishduishaiuhdiuhiuheiuhre',
      name: 'email service name',
    };

    it('validation should pass for valid object shapes', () => {
      const validationResult = runValidation(message, schemas.EMAIL_SERVICE);
      expect(validationResult.valid).to.eql(true);
      expect(validationResult.error === '').to.eql(true);
    });

    it('validation should fail for invalid object shapes', () => {
      const malformedMessage = { ...message, name: undefined };
      const validationResult = runValidation(
        malformedMessage,
        schemas.EMAIL_SERVICE,
      );
      expect(validationResult.valid).to.eql(false);
      expect(validationResult.error === '').to.eql(false);
    });
  });
});
