/**
 * This middleware checks if a certain Google Api scope has been required.
 * If not it returns an error with the url to redirect to in order to grant the permission.
 */

const _ = require('lodash');
const localData = require('../utils/local-data');
const googleApi = require('../facades/google-api');
const logger = require('../decorators/logger')('From require-scope');

module.exports = scope => {
  logger.debug('Inside assureScope');

  if (!scope || !scope.length) {
    logger.debug('A scope must be specified');
    throw new Error('A scope must be specified');
  }

  const isValid = _(googleApi.SCOPE_TYPE)
    .values()
    .indexOf(scope) !== -1;

  if (!isValid) {
    logger.debug('A scope must be specified');

    throw new Error(`Invalid scope: ${scope}`);
  }

  return (req, res, next) => {
    if (localData.ACCESS_SCOPES.indexOf(scope) === -1) {
      logger.debug('Missing scope: %s', scope);

      const scopesToAuthorise = _.concat([], localData.ACCESS_SCOPES, [scope]);
      logger.trace('scopesToAuthorise', scopesToAuthorise);

      logger.debug('Sending url to authorise');

      res.status(401).json({
        message: 'No access tokens. Please authorise the app to access your gmail account.',
        url: googleApi.getAuthorisationUrl(scopesToAuthorise)
      });

      return res.end();
    }

    return next();
  };
};

