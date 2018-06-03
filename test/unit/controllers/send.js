const proxyquire = require('proxyquire');

const sandbox = sinon.sandbox.create();

const res = { status: sandbox.stub() };
const logger = { error: sandbox.stub() };

const sendResponse = sandbox.stub();
const emailProvider = {
  sendEmailByFirstProviderAvailable: sandbox.stub(),
};

const sendController = proxyquire('../../../src/controllers/send', {
  '../providers/email-provider': () => emailProvider,
});

describe('Controllers: Send', () => {
  const req = { logger };
  beforeEach(() => {
    res.status.returns({ send: sendResponse });
  });

  afterEach(() => sandbox.reset());

  after(() => sandbox.restore());

  describe('When the request body is invalid', () => {
    beforeEach(async () => {
      const request = { ...req, body: {} };
      await sendController(request, res);
    });

    it('should return HTTP Status 400', async () => {
      expect(res.status).to.have.been.calledWith(400);
    });

    it('should return a message with `Invalid information:` prefix', async () => {
      const { message } = sendResponse.firstCall.args[0];
      expect(message).to.contain('Invalid information:');
    });
  });

  describe('When the email providers was not send', () => {
    beforeEach(async () => {
      const request = {
        ...req,
        body: {
          to: 'anothertest@inexistentdomain.com',
          from: 'test@inexistentdomain.com',
          text: 'Hello world',
          subject: 'This is a test',
        },
      };
      emailProvider.sendEmailByFirstProviderAvailable.resolves(false);
      await sendController(request, res);
    });

    it('should return HTTP Status 500', async () => {
      expect(res.status).to.have.been.calledWith(500);
    });

    it('should return the error message for HTTP Status 500', async () => {
      const { message } = sendResponse.firstCall.args[0];
      expect(message).to.eql(
        "Houston, we're having some problems and your email was not delivered. Try again later",
      );
    });
  });

  describe('When the email providers was not send', () => {
    beforeEach(async () => {
      const request = {
        ...req,
        body: {
          to: 'anothertest@inexistentdomain.com',
          from: 'test@inexistentdomain.com',
          text: 'Hello world',
          subject: 'This is a test',
        },
      };
      emailProvider.sendEmailByFirstProviderAvailable.resolves(true);
      await sendController(request, res);
    });

    it('should return HTTP Status 201', async () => {
      expect(res.status).to.have.been.calledWith(201);
    });

    it('should return the success message', async () => {
      const { message } = sendResponse.firstCall.args[0];
      expect(message).to.eql(
        'Your email will be delivered in the next minutes. Thank you!',
      );
    });
  });
});
