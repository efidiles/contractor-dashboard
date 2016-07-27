var proxyquire = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('Require email settings middleware', function () {
  var res;
  var next;
  var json;

  beforeEach(function () {
    json = sinon.spy();
    res = {
      status: sinon.stub().returns({
        json: json
      }),
      end: sinon.spy()
    };
    next = sinon.spy();
  });

  it('should report error if required parameters are missing', function () {
    var requireEmailSettings = proxyquire('../../middlewares/require-email-settings', {
      '../utils/local-data': {
        AGENT_EMAIL: undefined,
        CREDENTIALS: undefined
      }
    });

    var expectedResponse = {
      message: 'Missing configuration data.',
      errors: ['email_sender',
        'google_api_id',
        'google_api_secret',
        'google_api_redirect_url'
      ]
    };

    requireEmailSettings(undefined, res, next);

    expect(res.status.calledWith(422)).to.equal(true);
    expect(json.calledWith(expectedResponse)).to.equal(true);
    expect(res.end.called).to.equal(true);
    expect(next.called).to.equal(false);
  });

  it('should call next if everything is ok', function () {
    var requireEmailSettings = proxyquire('../../middlewares/require-email-settings', {
      '../utils/local-data': {
        AGENT_EMAIL: {
          FROM: 'test@example.org'
        },
        CREDENTIALS: {
          ID: 'someId',
          SECRET: 'someSecret',
          REDIRECT_URL: 'http://example.org'
        }
      }
    });

    requireEmailSettings(undefined, res, next);

    expect(res.end.called).to.equal(false);
    expect(next.called).to.equal(true);
  });
});
