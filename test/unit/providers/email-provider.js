const proxyquire = require('proxyquire');

const sandbox = sinon.createSandbox();
const mailgunProvider = sandbox.stub();
const sendgridProvider = sandbox.stub();
const mailgunSend = sandbox.stub();
const sendgridSend = sandbox.stub();

const logger = { info: sandbox.stub() };

const configureProvider = proxyquire('../../../src/providers/email-provider', {
  './mailgun': mailgunProvider,
  './sendgrid': sendgridProvider,
  '../core/logger': () => logger,
});

describe('Providers: Email provider', () => {
  let emailProvider;

  const emailData = {
    to: 'anothertest@inexistentdomain.com',
    from: 'test@inexistentdomain.com',
    text: 'Hello world',
    subject: 'This is a test',
  };

  beforeEach(async () => {
    mailgunProvider.returns({
      name: 'mailgun',
      send: mailgunSend,
    });

    sendgridProvider.returns({
      name: 'sendgrid',
      send: sendgridSend,
    });

    emailProvider = configureProvider();
  });

  afterEach(() => sandbox.reset());

  after(() => sandbox.restore());

  it('should start the email providers only once', () => {
    expect(mailgunProvider.callCount).to.eql(1);
    expect(sendgridProvider.callCount).to.eql(1);

    emailProvider = configureProvider();
    emailProvider = configureProvider();

    expect(mailgunProvider.callCount).to.eql(1);
    expect(sendgridProvider.callCount).to.eql(1);
  });

  describe('When the email returns an error', () => {
    let success;
    beforeEach(async () => {
      mailgunSend.resolves(false);
      sendgridSend.resolves(false);

      emailProvider = configureProvider();

      success = await emailProvider.sendEmailByFirstProviderAvailable(
        emailData,
      );
    });

    it('should return with success if one of the providers send the email', () => {
      expect(success).to.eql(false);
    });

    it('should try send the email using all the available providers', () => {
      expect(sendgridSend.callCount).to.eql(1);
      expect(mailgunSend.callCount).to.eql(1);
    });
  });

  describe('When the email is sent with success', () => {
    let success;
    beforeEach(async () => {
      mailgunSend.resolves(true);
      sendgridSend.resolves(false);

      emailProvider = configureProvider();
      success = await emailProvider.sendEmailByFirstProviderAvailable(
        emailData,
      );
    });

    it('should return with success if one of the providers send the email', async () => {
      expect(success).to.eql(true);
    });

    it('should stop if the first provider sends the email', async () => {
      expect(mailgunSend.callCount).to.eql(1);
      expect(sendgridSend.callCount).to.eql(0);
    });
  });
});
