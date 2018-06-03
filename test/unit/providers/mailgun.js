const nock = require('nock');
const configureProvider = require('../../../src/providers/mailgun');

const sandbox = sinon.createSandbox();

const logger = {
  error: sandbox.stub(),
  info: sandbox.stub(),
};

describe('Providers: Mailgun', () => {
  const mailgunUrl = 'http://dummy-mailgun-url.com';
  const mailgunSecretKey = 'abc123';
  const endpoint = '/messages';
  const emailData = {
    to: ['anothertest@inexistentdomain.com'],
    cc: 'anothertest@inexistentdomain.com',
    bcc: ['anothertest@inexistentdomain.com'],
    from: 'test@inexistentdomain.com',
    text: 'Hello world',
    subject: 'This is a test',
  };

  afterEach(() => {
    sandbox.reset();
  });

  after(() => {
    sandbox.restore();
    nock.cleanAll();
  });

  it('should throw an error if some of the required fields are not passed on bootstrap', () => {
    expect(() => configureProvider({ logger })).to.throw();
  });

  describe('When all required fields are passed', () => {
    let instance;
    let scope;

    beforeEach(() => {
      instance = configureProvider({ logger, mailgunUrl, mailgunSecretKey });
      scope = nock(mailgunUrl);
    });

    afterEach(() => {
      scope.done();
    });

    it('should return `true` if API responds 200 OK', async () => {
      scope.post(endpoint).reply(200, {});
      const success = await instance.send(emailData);
      expect(success).to.eql(true);
    });

    it('should return `false` if API responds a non 200 OK', async () => {
      scope.post(endpoint).reply(500, {});
      const success = await instance.send(emailData);
      expect(success).to.eql(false);
      expect(logger.error.firstCall).to.have.been.calledWith(
        `Mailgun API returned '500' for '${mailgunUrl}${endpoint}'`,
      );
    });
  });
});
