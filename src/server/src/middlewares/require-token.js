/**
 * This middleware checks if we have a previously stored token.
 * If not it returns an error with the url to redirect for the Google authorisation page.
 */

const _ = require('lodash');
const localData = require('../utils/local-data');
const googleApi = require('../facades/google-api');
const logger = require('../decorators/logger')('From require api token');

module.exports = (req, res, next) => {
  if (!_.get(localData, 'TOKEN.access_token')) {
    logger.debug('Missing token');
    logger.trace('localData', localData);

    res.status(401).json({
      message: 'No access tokens. Please authorise the app to access your gmail account.',
      url: googleApi.getAuthorisationUrl()
    });

    return res.end();
  }

  logger.debug('Token found. Setting credentials');
  googleApi.setCredentials(localData.TOKEN.access_token);

  return next();
};
