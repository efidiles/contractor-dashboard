var proxyquire = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('Require scope middleware', function () {
  var req;
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
    req = {
      app: {
        locals: {
          scopesToAuthorise: []
        }
      }
    };
    next = sinon.spy();
  });

  describe('With invalid initialisation data', function () {
    it('should throw an error if the scope is not specified', function () {
      var requireScope = proxyquire('../../middlewares/require-scope', {
        '../facades/google-api': {
          SCOPE_TYPE: {
            GMAIL: 'https://mail.google.com/'
          }
        }
      });

      function createWithoutScope() {
        requireScope();
      }

      expect(createWithoutScope).to.throw(/A scope must be specified/);

      function createWithEmptyString() {
        requireScope('');
      }

      expect(createWithEmptyString).to.throw(/A scope must be specified/);
    });

    it('should throw an error if required scope doesn\'t exist', function () {
      var requireScope = proxyquire('../../middlewares/require-scope', {
        '../facades/google-api': {
          SCOPE_TYPE: {
            GMAIL: 'https://mail.google.com/'
          }
        }
      });

      function createMiddleware() {
        requireScope('https://inexistent.com/');
      }

      expect(createMiddleware).to.throw(/Invalid scope/);
    });
  });

  describe('With valid initialisation data', function () {
    it('should return a function if the scope is valid', function () {
      var requireScope = proxyquire('../../middlewares/require-scope', {
        '../facades/google-api': {
          SCOPE_TYPE: {
            GMAIL: 'https://mail.google.com/'
          }
        }
      });

      var middleware = requireScope('https://mail.google.com/');
      expect(Object.prototype.toString.call(middleware) === '[object Function]').to.equal(true);
    });

    it('should report error if the required scope is not set', function () {
      var requireScope = proxyquire('../../middlewares/require-scope', {
        '../facades/google-api': {
          SCOPE_TYPE: {
            GMAIL: 'https://mail.google.com/'
          }
        },
        '../utils/local-data': {
          ACCESS_SCOPES: []
        }
      });

      var expectedResponse = {
        message: '.',
        url: ''
      };

      var middleware = requireScope('https://mail.google.com/');
      middleware(req, res, next);

      expect(res.status.calledWith(401)).to.equal(true);
      expect(json.args[0][0].message).to.equal('No access tokens. Please authorise the app to ' +
        'access your gmail account.');
      expect(json.args[0][0].url.indexOf('https://accounts.google.com/o/oauth2')).to.equal(0);
      expect(res.end.called).to.equal(true);
      expect(next.called).to.equal(false);
    });

    it('should call next if everything is ok', function () {
      var requireScope = proxyquire('../../middlewares/require-scope', {
        '../facades/google-api': {
          SCOPE_TYPE: {
            GMAIL: 'https://mail.google.com/'
          }
        },
        '../utils/local-data': {
          ACCESS_SCOPES: ['https://mail.google.com/']
        }
      });

      var middleware = requireScope('https://mail.google.com/');
      middleware(req, res, next);

      expect(res.end.called).to.equal(false);
      expect(next.called).to.equal(true);
    });
  });
});
