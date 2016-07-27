var proxyquire = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('auth route', function () {
  var res;
  var next;
  var json;
  var locals = {
    error: sinon.spy(),
    success: sinon.spy()
  };

  beforeEach(function () {
    json = sinon.spy();
    res = {
      status: sinon.stub().returns({
        json: json
      }),
      end: sinon.spy(),
      locals: locals,
      redirect: sinon.stub()
    };
    next = sinon.spy();
  });

  describe('/callback', function () {
    describe('Request is missing token parameter', function () {
      it('should return an error if authorisation token is missing from request', function () {
        var authRouter = require('../../routes/auth');

        authRouter.callback({}, res);

        expect(res.locals.error.calledWith(401)).to.be.true;
        expect(res.end.called).to.be.true;
      });
    });

    describe('Request has token parameter', function () {
      var req;
      var getTokenMock;
      var localDataMock;
      var authRouter;

      beforeEach(function () {
        req = {
          query: {
            code: 'someCode'
          }
        };

        getTokenMock = sinon.stub().returns(Promise.resolve(['someAuthToken']));

        localDataMock = {
          TOKEN: undefined,
          ACCESS_SCOPES: [],
          save: sinon.spy()
        };

        authRouter = proxyquire('../../routes/auth', {
          '../utils/local-data': localDataMock,
          '../facades/google-api': {
            getToken: getTokenMock
          }
        });
      });

      it('should retrieve an authentication token using the google api module', function (done) {
        authRouter.callback(req, res)
          .then(function () {
            expect(getTokenMock.calledWith('someCode')).to.be.true;
            expect(res.end.called).to.be.true;
            done();
          });
      });

      it('should save the auth token if successfully retrieved', function (done) {
        expect(localDataMock.TOKEN).to.not.be.ok;
        expect(localDataMock.save.called).to.be.false;

        authRouter.callback(req, res)
          .then(function () {
            expect(localDataMock.TOKEN[0]).to.equal('someAuthToken');
            expect(localDataMock.save.called).to.be.true;
            done();
          });
      });

      it('should save the scope if authorisation is successful', function (done) {
        req.app = {
          locals: {
            scopesToAuthorise: ['https://mail.google.com/']
          }
        };

        expect(localDataMock.ACCESS_SCOPES).to.eql([]);

        authRouter.callback(req, res)
          .then(function () {
            expect(localDataMock.ACCESS_SCOPES).to.eql(['https://mail.google.com/']);
            done();
          });
      });

      it('should return an error if localData.URLS.APP_ROOT is not set', function (done) {
        localDataMock.URLS = {
          APP_ROOT: undefined
        };

        req.app = {
          locals: {
            scopesToAuthorise: ['https://mail.google.com/']
          }
        };

        authRouter.callback(req, res)
          .catch(function () {
            expect(res.locals.error.calledWith(401)).to.be.true;
            expect(res.end.called).to.be.true;
            done();
          });
      });

      it('should redirect if the auth token is successfully retrieved and saved', function (done) {
        localDataMock.URLS = {
          APP_ROOT: 'http://someUrl.local'
        };

        req.app = {
          locals: {
            scopesToAuthorise: ['https://mail.google.com/']
          }
        };

        expect(localDataMock.ACCESS_SCOPES).to.eql([]);

        authRouter.callback(req, res)
          .then(function () {
            expect(res.redirect.calledWith(localDataMock.URLS.APP_ROOT)).to.be.true;
            done();
          });
      });
    });
  });
});
