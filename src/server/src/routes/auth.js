const _ = require('lodash');

const localData = require('../utils/local-data');
const googleApi = require('../facades/google-api');
const logger = require('../decorators/logger')('From auth router');

const saveData = (req, token) => {
  logger.debug('Saving token');

  localData.TOKEN = token;
  localData.ACCESS_SCOPES = googleApi.getScopes();

  return localData.save();
};

const callback = (req, res) => {
  logger.debug('Inside callback route');
  logger.trace('req', req);

  if (!_.get(req, 'query.code.length')) {
    logger.error('Missing authorisation code');

    res.locals.error(401, 'Missing authorisation code', true);
    return res.end();
  }

  logger.debug('Authorisation found');

  return googleApi.getToken(req.query.code)
    .then(token => saveData(req, token))
    .then(() => {
      logger.debug('Token retrieved and saved');

      if (!_.get(localData, 'URLS.APP_ROOT')) {
        logger.error('Missing APP_ROOT parameter');
        return Promise.reject('Missing APP_ROOT parameter');
      }

      logger.debug('Redirecting to root');
      logger.trace(localData.URLS.APP_ROOT);

      return Promise.resolve(res.redirect(localData.URLS.APP_ROOT));
    })
    .catch(err => {
      logger.error(err);

      res.locals.error(401, 'Authorisation failed', true);
      res.end();

      return Promise.reject(err);
    });
};

module.exports = {
  callback
};
