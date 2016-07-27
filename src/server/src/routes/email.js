const _ = require('lodash');

const emailSender = require('../facades/email-sender');
const googleApi = require('../facades/google-api');
const logger = require('../decorators/logger')('From email router');

const send = (req, res) => {
  logger.debug('Inside email route');

  const missingParameters = _.compact([
    req.body.to ? undefined : 'missing_to',
    req.body.subject ? undefined : 'missing_subject',
    req.body.content ? undefined : 'missing_content'
  ]);

  if (missingParameters.length) {
    res.status(422).json({
      message: 'Must provide all required parameters',
      errors: missingParameters
    });

    res.end();
    return Promise.reject();
  }

  return emailSender.sendEmail(req.body.to, req.body.subject, req.body.content, req.files)
    .then(() => {
      res.locals.success('Email sent successfully', true);
      return res.end();
    })
    .catch(err => {
      if (err.message === 'invalid_grant') {
        res.status(401).json({
          message: 'The application is not authorised. Please open the url to authorise',
          url: googleApi.getAuthorisationUrl()
        });

        res.end();
        return Promise.reject(err);
      }

      logger.debug(err);
      res.locals.error(400, 'Error sending email', true);

      res.end();
      return Promise.reject(err);
    });
};

module.exports = {
  send
};
