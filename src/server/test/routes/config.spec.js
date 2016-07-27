var proxyquire = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('config route', function () {
  var res;
  var next;
  var json;
  var req;
  var locals;

  beforeEach(function () {
    req = {
      body: {}
    };
    json = sinon.spy();
    locals = {
      error: sinon.spy(),
      success: sinon.spy()
    };
    res = {
      status: sinon.stub().returns({
        json: json
      }),
      end: sinon.spy(),
      locals: locals,
      redirect: sinon.stub()
    };
  });

  describe('/app', function () {
    it('should save the data passed in the request', function (done) {
      var localDataMock = {
        save: sinon.stub().returns(Promise.resolve())
      };

      var configRouter = proxyquire('../../routes/config', {
        '../utils/local-data': localDataMock
      });

      req.body.firstName = 'firstName';
      req.body.lastName = 'lastName';
      req.body.companyName = 'companyName';
      req.body.googleApiId = 'googleApiId';
      req.body.googleApiSecret = 'googleApiSecret';
      req.body.googleApiRedirectUrl = 'googleApiRedirectUrl';

      configRouter.app.save(req, res)
        .then(function () {
          expect(localDataMock.USER.FIRST_NAME).to.equal('firstName');
          expect(localDataMock.USER.LAST_NAME).to.equal('lastName');
          expect(localDataMock.USER.COMPANY_NAME).to.equal('companyName');
          expect(localDataMock.CREDENTIALS.ID).to.equal('googleApiId');
          expect(localDataMock.CREDENTIALS.SECRET).to.equal('googleApiSecret');
          expect(localDataMock.CREDENTIALS.REDIRECT_URL).to.equal('googleApiRedirectUrl');

          expect(localDataMock.save.called).to.be.true;
          expect(res.status.calledWith(200)).to.be.true;
          expect(res.end.called).to.be.true;
          done();
        });
    });

    it('should return an error if data could not be saved', function (done) {
      var localDataMock = {
        save: sinon.stub().returns(Promise.reject())
      };

      var configRouter = proxyquire('../../routes/config', {
        '../utils/local-data': localDataMock
      });

      configRouter.app.save(req, res)
        .catch(function () {
          expect(res.locals.error.called).to.be.true;
          expect(res.end.called).to.be.true;
          done();
        });
    });

    it('should be able to fetch the saved app data', function () {
      var localDataMock = {
        USER: {
          FIRST_NAME: 'firstName',
          LAST_NAME: 'lastName',
          COMPANY_NAME: 'companyName'
        },
        CREDENTIALS: {
          ID: 'googleApiId',
          SECRET: 'googleApiSecret',
          REDIRECT_URL: 'googleApiRedirectUrl'
        },
        save: sinon.stub().returns(Promise.resolve())
      };

      var configRouter = proxyquire('../../routes/config', {
        '../utils/local-data': localDataMock
      });

      var expectation = {
          firstName: 'firstName',
          lastName: 'lastName',
          companyName: 'companyName',
          googleApiId: 'googleApiId',
          googleApiSecret: 'googleApiSecret',
          googleApiRedirectUrl: 'googleApiRedirectUrl'
      };

      configRouter.app.load(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(json.calledWith(expectation)).to.be.true;
      expect(res.end.called).to.be.true;
    });
  });

  describe('/agent-email', function () {
    it('should save the data passed in the request', function (done) {
      var localDataMock = {
        save: sinon.stub().returns(Promise.resolve())
      };

      var configRouter = proxyquire('../../routes/config', {
        '../utils/local-data': localDataMock
      });

      req.body.from = 'from';
      req.body.receipients = 'receipients';
      req.body.subjectTemplate = 'subjectTemplate';
      req.body.bodyTemplate = 'bodyTemplate';

      configRouter.agentEmail.save(req, res)
        .then(function () {
          expect(localDataMock.AGENT_EMAIL.FROM).to.equal('from'),
          expect(localDataMock.AGENT_EMAIL.RECEIPIENTS).to.equal('receipients'),
          expect(localDataMock.AGENT_EMAIL.SUBJECT_TEMPLATE).to.equal('subjectTemplate'),
          expect(localDataMock.AGENT_EMAIL.BODY_TEMPLATE).to.equal('bodyTemplate');

          expect(localDataMock.save.called).to.be.true;
          expect(res.status.calledWith(200)).to.be.true;
          expect(res.end.called).to.be.true;
          done();
        });
    });

    it('should return an error if data could not be saved', function () {
      var localDataMock = {
        save: sinon.stub().returns(Promise.reject())
      };

      var configRouter = proxyquire('../../routes/config', {
        '../utils/local-data': localDataMock
      });

      configRouter.agentEmail.save(req, res)
        .catch(function () {
          expect(res.locals.error.called).to.be.true;
          expect(res.end.called).to.be.true;
          done();
        });
    });

    it('should be able to fetch the saved app data', function () {
      var localDataMock = {
        AGENT_EMAIL: {
          FROM: 'from',
          RECEIPIENTS: 'receipients',
          SUBJECT_TEMPLATE: 'subjectTemplate',
          BODY_TEMPLATE: 'bodyTemplate'
        },
        save: sinon.stub().returns(Promise.resolve())
      };

      var configRouter = proxyquire('../../routes/config', {
        '../utils/local-data': localDataMock
      });

      var expectation = {
        from: 'from',
        receipients: 'receipients',
        subjectTemplate: 'subjectTemplate',
        bodyTemplate: 'bodyTemplate'
      };

      configRouter.agentEmail.load(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(json.calledWith(expectation)).to.be.true;
      expect(res.end.called).to.be.true;
    });
  });
});
