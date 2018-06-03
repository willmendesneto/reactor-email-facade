const ignoreFavicon = require('../../../src/middlewares/ignore-favicon');

const sandbox = sinon.createSandbox();
const next = sandbox.stub();
const res = {
  status: sandbox.stub(),
  json: sandbox.stub(),
};

describe('Middlewares: Ignore favicon', () => {
  afterEach(() => sandbox.reset());

  after(() => sandbox.restore());

  it('should respond with HTTP Status code 204 if is requesting for favicon', () => {
    const req = { originalUrl: '/favicon.ico' };

    ignoreFavicon(req, res, next);

    expect(res.status).to.have.been.calledWith(204);
    expect(res.json).to.have.been.calledWith({ nope: true });
    expect(next.callCount).to.eql(0);
  });

  it('should pass to the next middleware if is NOT requesting for favicon', () => {
    const req = { originalUrl: '' };

    ignoreFavicon(req, res, next);

    expect(res.status.callCount).to.eql(0);
    expect(res.json.callCount).to.eql(0);
    expect(next.callCount).to.eql(1);
  });
});
