var proxyquire = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('Require token middleware', function () {
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

  it('should return an error response if a stored token is not found', function () {
    var getAuthorisationUrlMock = sinon.stub().returns('http://someUrl.org');

    var requireToken = proxyquire('../../middlewares/require-token', {
      '../utils/local-data': {
        TOKEN: {
          access_token: undefined
        }
      },
      '../facades/google-api': {
        getAuthorisationUrl: getAuthorisationUrlMock
      }
    });

    requireToken(undefined, res, next);

    expect(res.status.calledWith(401)).to.equal(true);
    expect(json.args[0][0].message).to.equal('No access tokens. Please authorise the app to ' +
      'access your gmail account.');
    expect(json.args[0][0].url).to.equal('http://someUrl.org');
    expect(res.end.called).to.equal(true);
    expect(next.called).to.equal(false);
  });

  it('should authenticate if a stored token is found', function () {
    var setCredentials = sinon.spy();
    var requireToken = proxyquire('../../middlewares/require-token', {
      '../facades/google-api': {
        setCredentials: setCredentials
      },
      '../utils/local-data': {
        TOKEN: {
          access_token: 'someValue'
        }
      }
    });

    requireToken(undefined, res, next);

    expect(setCredentials.calledWith('someValue')).to.equal(true);
    expect(res.end.called).to.equal(false);
    expect(next.called).to.equal(true);
  });
});
