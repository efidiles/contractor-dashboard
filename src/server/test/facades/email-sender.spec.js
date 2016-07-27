const proxyquire = require('proxyquire');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('Email sender facade', function () {
  xit('should reload configuration when localData is saved', function () {});
  it('should load configuration on init', function () {
      const createTransport = sinon.stub().returns({
        sendMailAsync: Function.prototype
      });
      const emailSender = proxyquire('../../facades/email-sender.js', {
        'nodemailer': {
          createTransport: createTransport
        },
        '../utils/local-data': {
          AGENT_EMAIL: {
            FROM: 'example@example.org'
          },
          CREDENTIALS: {
            ID: 'someId',
            SECRET: 'someSecret'
          },
          TOKEN: {
            access_token: 'someToken',
            refresh_token: 'someToken'
          }
        }
      });

      expect(createTransport.called).to.be.true;
  });

  describe('sendEmail method', function () {
    xit('should throw an error if sender email is missing', function () {});
    xit('should throw an error if destination is missing', function () {});
    xit('should throw an error if subject is missing', function () {});
    xit('should throw an error if content is missing', function () {});
    xit('should attach the files if specified', function () {});
  });

  describe('loadConfig method', function () {
    xit('should perform authentication with google api', function () {});
    xit('should save the token when authentication is done', function () {});

    describe('Missing data', function () {
      xit('should throw an error if sender email is missing', function () {});
      xit('should throw an error if Google API ID', function () {});
      xit('should throw an error if Google API secret', function () {});
      xit('should throw an error if refresh token', function () {});
      xit('should throw an error if access token', function () {});
    });
  });
});
