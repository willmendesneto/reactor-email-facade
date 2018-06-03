const proxyquire = require('proxyquire');

const sandbox = sinon.createSandbox();
const pinoMock = sandbox.stub();
const loggerProvider = proxyquire('../../../src/core/logger', {
  pino: pinoMock,
});

describe('Core: logger', () => {
  beforeEach(() => pinoMock.returns({}));

  afterEach(() => sandbox.reset());

  after(() => sandbox.restore());

  it('should NOT create multiple instances of the same logger if called multiple times', () => {
    expect(pinoMock.callCount).to.be.eql(0);
    const logger = loggerProvider();
    const secondLogger = loggerProvider();

    expect(pinoMock.callCount).to.be.eql(1);
    expect(pinoMock.callCount).to.be.eql(1);
    expect(secondLogger).to.equal(logger);
  });
});
