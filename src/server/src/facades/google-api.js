const google = require('googleapis');
const promisify = require('es6-promisify');
const _ = require('lodash');

const localData = require('../utils/local-data');
const logger = require('../decorators/logger')('From google api');

const OAuth2Client = google.auth.OAuth2;
const SCOPE_TYPE = {
  GMAIL: 'https://mail.google.com/'
};
let CREDENTIALS;
let oauth2Client;
let _scopes;

function init() {
  logger.debug('Inside init');

  if (!_.get(localData, 'CREDENTIALS.ID') ||
    !_.get(localData, 'CREDENTIALS.SECRET') ||
    !_.get(localData, 'CREDENTIALS.REDIRECT_URL')) {
    logger.error('Credentials not set. Throwing error');
    throw new Error('Credentials are missing');
  }

  logger.debug('Setting oAuth2Client');

  CREDENTIALS = localData.CREDENTIALS;
  oauth2Client = new OAuth2Client(CREDENTIALS.ID, CREDENTIALS.SECRET, CREDENTIALS.REDIRECT_URL);
}

/**
 * Gets an authorisation url
 * @method getAuthorisationUrl
 */
function getAuthorisationUrl(scopes) {
  logger.debug('Inside getAuthorisationUrl');
  logger.trace('scopes', scopes);

  if (!oauth2Client) {
    init();
  }

  _scopes = scopes || localData.ACCESS_SCOPES;
  logger.trace('scopes', _scopes);

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    approval_prompt: 'force',
    scope: _scopes
  });

  return url;
}

function getScopes() {
  return _scopes;
}

/**
 * Gets an authentication token
 * @method getToken
 */
function getToken(authorisationCode) {
  logger.debug('Inside getToken');

  if (!authorisationCode) {
    const message = 'Missing authorisationCode';
    logger.error(message);
    throw new Error(message);
  }

  if (!oauth2Client) {
    init();
  }

  const _getToken = promisify(oauth2Client.getToken.bind(oauth2Client));

  return _getToken(authorisationCode)
    .then(tokens => {
      logger.debug('Token received');
      logger.trace('tokens', tokens);

      const authToken = tokens.access_token;
      logger.trace('authToken', authToken);
      this.setCredentials(authToken); // this is oauth2Client

      return tokens;
    });
}

/**
 * Sets the authentication token to be used by the google api module
 * @method setCredentials
 */
function setCredentials(token) {
  logger.debug('Inside setCredentials');

  if (!token) {
    logger.error('A token must be specified');
    throw new Error('No token specified');
  }

  if (!oauth2Client) {
    init();
  }

  logger.debug('Setting credentials');

  oauth2Client.setCredentials(token);
}

module.exports = {
  SCOPE_TYPE,
  getScopes,
  setCredentials,
  getToken,
  getAuthorisationUrl
};
