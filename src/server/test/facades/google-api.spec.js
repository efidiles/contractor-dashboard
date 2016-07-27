const proxyquire = require('proxyquire');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('Google api facade', () => {
  it('should expose the available scope types', () => {
    const googleApi = require('../../src/facades/google-api.js');

    expect(googleApi.SCOPE_TYPE).to.be.ok;
  });

  it('should throw if credentials are missing', () => {
    const googleApi = proxyquire('../../src/facades/google-api.js', {
      '../utils/local-data': {
        CREDENTIALS: undefined
      }
    });

    expect(() => googleApi.init()).to.throw();
  });

  describe('setCredentials()', function () {
    it('should throw if oauth2Client or the token is missing', function () {
      const googleApi = require('../../src/facades/google-api.js');

      expect(() => googleApi.setCredentials()).to.throw;

      expect(() => googleApi.setCredentials('someToken')).to.throw;
    });

    it('should set the credentials for interacting with google api', () => {
      const setCredentialsMock = sinon.spy();
      const OAuth2ClientMock = function () {
        this.setCredentials = setCredentialsMock;
      };

      const googleApi = proxyquire('../../src/facades/google-api.js', {
        googleapis: {
          auth: {
            OAuth2: OAuth2ClientMock
          }
        },
        '../utils/local-data': {
          CREDENTIALS: {
            ID: 'test',
            SECRET: 'test',
            REDIRECT_URL: 'test'
          }
        }
      });

      googleApi.init();

      googleApi.setCredentials('someToken');

      expect(setCredentialsMock.calledWith('someToken')).to.be.true;
    });
  });

  describe('getToken()', function () {
    it('should throw if oauth2Client or the token is missing', function () {
      const googleApi = require('../../src/facades/google-api.js');

      expect(() => googleApi.setCredentials()).to.throw;

      expect(() => googleApi.setCredentials('someToken')).to.throw;
    });

    it('should get a valid token', (done) => {
      const oAuth2ClientGetTokenMock = sinon.stub()
        .returns(Promise.resolve(['someAuthenticationToken']));
      const OAuth2ClientMock = function () {
        this.getToken = Function.prototype;
      };

      const googleApi = proxyquire('../../src/facades/google-api.js', {
        googleapis: {
          auth: {
            OAuth2: OAuth2ClientMock
          }
        },
        'es6-promisify': sinon.stub().returns(oAuth2ClientGetTokenMock),
        '../utils/local-data': {
          CREDENTIALS: {
            ID: 'test',
            SECRET: 'test',
            REDIRECT_URL: 'test'
          }
        }
      });

      googleApi.init();

      googleApi.setCredentials = sinon.stub();

      googleApi.getToken('someAuthorisationToken')
        .then(function (authToken) {
          expect(oAuth2ClientGetTokenMock.calledWith('someAuthorisationToken')).to.be.true;
          expect(googleApi.setCredentials.calledWith('someAuthenticationToken')).to.be.true;
          expect(authToken).to.equal('someAuthenticationToken');
          done();
        });
    });
  });

  describe('getAuthorisationUrl()', () => {
    it('should throw if oauth2ClientMock is missing or no scopes are specified', () => {
      const OAuth2ClientMock = function () {};
      const googleApi = proxyquire('../../src/facades/google-api.js', {
        'googleapis': {
          auth: {
            OAuth2: OAuth2ClientMock
          }
        },
        '../utils/local-data': {
          CREDENTIALS: {
            ID: 'test',
            SECRET: 'test',
            REDIRECT_URL: 'test'
          }
        }
      });

      expect(() => googleApi.getAuthorisationUrl()).to.throw();

      googleApi.init();

      expect(() => googleApi.getAuthorisationUrl()).to.throw();
    });

    it('should call the generateAuthUrl on the google api module', function () {
      const oauth2ClientGenerateAuthUrlMock = sinon.spy();
      const OAuth2ClientMock = function() {
        this.generateAuthUrl = oauth2ClientGenerateAuthUrlMock;
      };
      const googleApi = proxyquire('../../src/facades/google-api.js', {
        googleapis: {
          auth: {
            OAuth2: OAuth2ClientMock
          }
        },
        '../utils/local-data': {
          CREDENTIALS: {
            ID: 'test',
            SECRET: 'test',
            REDIRECT_URL: 'test'
          }
        }
      });
      const scopesToGetAccess = ['https://mail.google.com/'];

      googleApi.init();

      googleApi.getAuthorisationUrl(scopesToGetAccess);

      expect(oauth2ClientGenerateAuthUrlMock.calledWith({
        access_type: 'offline',
        approval_prompt: 'force',
        scope: scopesToGetAccess
      })).to.be.true;
    });
  });
});
