/**
 * This middleware will check if the settings for sending emails are set.
 */

const _ = require('lodash');

const localData = require('../utils/local-data');
const logger = require('../decorators/logger')('From require-email-settings');

module.exports = (req, res, next) => {
  logger.debug('Inside requireSettings');

  const missingData = _.compact([
    _.get(localData, 'AGENT_EMAIL.FROM') ? undefined : 'email_sender',
    _.get(localData, 'CREDENTIALS.ID') ? undefined : 'google_api_id',
    _.get(localData, 'CREDENTIALS.SECRET') ? undefined : 'google_api_secret',
    _.get(localData, 'CREDENTIALS.REDIRECT_URL') ? undefined : 'google_api_redirect_url'
  ]);

  if (missingData.length) {
    logger.debug('Missing configuration data');

    res.status(422).json({
      message: 'Missing configuration data.',
      errors: missingData
    });

    return res.end();
  }

  logger.debug('Settings valid');

  return next();
};
