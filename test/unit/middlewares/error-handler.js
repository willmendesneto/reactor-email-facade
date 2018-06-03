const proxyquire = require('proxyquire');

const sandbox = sinon.createSandbox();

const logger = {
  error: sandbox.stub(),
};
const config = {
  get: sandbox.stub(),
};

const next = sandbox.stub();

const errorHandler = proxyquire('../../../src/middlewares/error-handler', {
  '../core/logger': () => logger,
  config,
});

describe('Middlewares: Error Halder', () => {
  let res;

  beforeEach(() => {
    config.get.returns(false);
    res = {
      status: sandbox.stub(),
      json: sandbox.stub(),
    };
  });

  afterEach(() => sandbox.reset());

  after(() => sandbox.restore());

  it('should log the given error', () => {
    const error = {
      message: 'This is an error message',
      stack: 'Stack for the test',
      status: 404,
    };

    errorHandler(error, null, res, next);

    expect(logger.error).to.have.been.calledWith(error);
  });

  it('should NOT keep the flow if response have `headersSent`', () => {
    const error = {
      message: 'This is an error message',
      stack: 'Stack for the test',
      status: 404,
    };

    errorHandler(error, null, { ...res, headersSent: true }, next);

    expect(next).to.have.been.calledWith(error);
  });

  it('should keep the flow if response does NOT have `headersSent`', () => {
    const error = {
      message: 'This is an error message',
      stack: 'Stack for the test',
      status: 404,
    };

    errorHandler(error, null, res, next);

    expect(next.callCount).to.eql(0);
  });

  it('should set the status code based on the error if HTTP Status code is between 400 and 499', () => {
    const error = {
      message: 'This is an error message',
      stack: 'Stack for the test',
      status: 404,
    };

    errorHandler(error, null, res, next);

    expect(res.status).to.have.been.calledWith(error.status);
    expect(next.callCount).to.eql(0);
  });

  it('should force status code to 500 if HTTP Status code is above 499', () => {
    const error = {
      message: 'This is an error message',
      stack: 'Stack for the test',
      status: 503,
    };

    errorHandler(error, null, res, next);

    expect(res.status).to.have.been.calledWith(500);
    expect(next.callCount).to.eql(0);
  });

  it('should add stack in the response if the app is not running in production', () => {
    const error = {
      message: 'This is an error message',
      stack: 'Stack for the test',
      status: 404,
    };

    errorHandler(error, null, res, next);

    expect(res.json).to.have.been.calledWith({
      stack: error.stack,
    });
    expect(next.callCount).to.eql(0);
  });

  it('should add stack with the error in the response if the app is not running in production and error does not have `stack` property', () => {
    const error = {
      message: 'This is an error message',
      status: 404,
    };

    errorHandler(error, null, res, next);

    expect(res.json).to.have.been.calledWith({
      stack: error,
    });
    expect(next.callCount).to.eql(0);
  });

  it('should return an empty object if the app is not running in production', () => {
    config.get.returns(true);
    const error = {
      message: 'This is an error message',
      stack: 'Stack for the test',
      status: 404,
    };

    errorHandler(error, null, res, next);

    expect(res.json).to.have.been.calledWith({});
    expect(next.callCount).to.eql(0);
  });

  it('should force status code to 500 if HTTP Status code is above 499', () => {
    const error = {
      message: 'This is an error message',
      stack: 'Stack for the test',
      status: 503,
    };

    errorHandler(error, null, res, next);

    expect(res.json).to.have.been.calledWith({
      message: 'Internal Server Error',
      stack: error.stack,
    });
    expect(next.callCount).to.eql(0);
  });
});
