var proxyquire = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('Email route', function () {
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

  it('should return an error if required parameters are missing from request', function (done) {
    var emailRouter = proxyquire('../../routes/email', {
      '../facades/email-sender': {
        sendEmail: sinon.stub()
      },
      '../facades/google-api': {
        getAuthorisationUrl: sinon.stub(),
        '@noCallThru': true
      },
      '../utils/local-data': {
        CREDENTIALS: {
          ID: '',
          SECRET: '',
          REDIRECT_URL: ''
        }
      }
    });

    var expectedError = {
      message: 'Must provide all required parameters',
      errors: ['missing_to',
        'missing_subject',
        'missing_content'
      ]
    };

    emailRouter.send(req, res)
      .catch(function () {
        expect(res.status.calledWith(422));
        expect(json.calledWithExactly(expectedError));
        expect(res.end.called);
        done();
      });
  });

  it('should send an error with instructions to authorise if request is not authorised',
    function (done) {
      var emailRouter = proxyquire('../../routes/email', {
        '../facades/email-sender': {
          sendEmail: sinon.stub().returns(Promise.reject({
            message: 'invalid_grant'
          }))
        },
        '../facades/google-api': {
          getAuthorisationUrl: sinon.stub().returns('http://someUrl.org'),
          '@noCallThru': true
        },
        '../utils/local-data': {
          CREDENTIALS: {
            ID: '',
            SECRET: '',
            REDIRECT_URL: ''
          }
        }
      });

      var expectedError = {
        message: 'The application is not authorised. Please open the url to authorise',
        url: 'http://someUrl.org'
      };

      req.body.to = 'to';
      req.body.subject = 'subject';
      req.body.content = 'content';

      emailRouter.send(req, res)
        .catch(function () {
          expect(res.status.calledWith(401));
          expect(json.calledWithExactly(expectedError));
          expect(res.end.called);
          done();
        });
    });

  it('should send a generic error response if other errors occur', function (done) {
    var emailRouter = proxyquire('../../routes/email', {
      '../facades/email-sender': {
        sendEmail: sinon.stub().returns(Promise.reject({
          message: 'invalid_grant'
        }))
      },
      '../facades/google-api': {
        getAuthorisationUrl: sinon.stub().returns('http://someUrl.org'),
        '@noCallThru': true
      },
      '../utils/local-data': {
        CREDENTIALS: {
          ID: '',
          SECRET: '',
          REDIRECT_URL: ''
        }
      }
    });

    req.body.to = 'to';
    req.body.subject = 'subject';
    req.body.content = 'content';

    emailRouter.send(req, res)
      .catch(function () {
        expect(res.locals.error.calledWith(400, 'Error sending email', true));
        expect(res.end.called);
        done();
      });
  });

  it('should be able to send attachments', function () {});

  it('should send a success response if if sending is successful', function () {});
});
