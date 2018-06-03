const chai = require('chai');
const nock = require('nock');
const app = require('../../src/app');

describe.only('Integration: Send Email endpoint', () => {
  let server;

  const request = {
    to: ['anothertest@inexistentdomain.com'],
    cc: 'anothertest@inexistentdomain.com',
    bcc: ['anothertest@inexistentdomain.com'],
    from: 'test@inexistentdomain.com',
    text: 'Hello world',
    subject: 'This is a test',
  };

  before(() => {
    server = app.listen();
  });

  after(() => server.close());

  afterEach(() => nock.cleanAll());

  it('POST `/` should return HTTP Status 400 if all API receives a malformed request', async () => {
    const res = await chai
      .request(server)
      .post('/v1/')
      .send({ ...request, from: undefined })
      .redirects(0);

    expect(res).to.have.status(400);
    expect(res.body.message).to.contain('Invalid information');
  });

  it('POST `/` should return HTTP Status 500 if all email providers respond with error', async () => {
    nock(process.env.MAILGUN_URL)
      .post('/messages')
      .reply(400, {});

    nock(process.env.SENDGRID_URL)
      .post('/v3/mail/send')
      .reply(500, {});

    const res = await chai
      .request(server)
      .post('/v1/')
      .send(request)
      .redirects(0);

    const message =
      "Houston, we're having some problems and your email was not delivered. Try again later";
    expect(res).to.have.status(500);
    expect(res.body).to.eql({ message });
  });

  it('POST `/` should return HTTP Status 200 if one email providers respond with success', async () => {
    nock(process.env.MAILGUN_URL)
      .post('/messages')
      .reply(400, {});

    nock(process.env.SENDGRID_URL)
      .post('/v3/mail/send')
      .reply(202, {});

    const res = await chai
      .request(server)
      .post('/v1/')
      .send(request)
      .redirects(0);

    const message =
      'Your email will be delivered in the next minutes. Thank you!';
    expect(res).to.have.status(201);
    expect(res.body).to.eql({ message });
  });
});
