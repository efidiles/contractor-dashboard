const localData = require('../utils/local-data');
const logger = require('../decorators/logger')('From config router');

function saveApp(req, res) {
  logger.debug('Inside app config save route');

  localData.USER.FIRST_NAME = req.body.firstName || localData.USER.FIRST_NAME;
  localData.USER.LAST_NAME = req.body.lastName || localData.USER.LAST_NAME;
  localData.USER.COMPANY_NAME = req.body.companyName || localData.USER.COMPANY_NAME;
  localData.CREDENTIALS.ID = req.body.googleApiId || localData.CREDENTIALS.ID;
  localData.CREDENTIALS.SECRET = req.body.googleApiSecret || localData.CREDENTIALS.SECRET;
  localData.CREDENTIALS.REDIRECT_URL =
    req.body.googleApiRedirectUrl || localData.CREDENTIALS.REDIRECT_URL;

  return localData.save()
    .then(() => {
      logger.debug('Configuration saved');
      res.status(200);
      res.end();
    })
    .catch(error => {
      res.locals.error('Could not save configuration', true);
      res.end();
      return Promise.reject(error);
    });
}

function loadApp(req, res) {
  logger.debug('Inside app config load route');

  res.status(200).json({
    firstName: localData.USER.FIRST_NAME,
    lastName: localData.USER.LAST_NAME,
    companyName: localData.USER.COMPANY_NAME,
    googleApiId: localData.CREDENTIALS.ID,
    googleApiSecret: localData.CREDENTIALS.SECRET,
    googleApiRedirectUrl: localData.CREDENTIALS.REDIRECT_URL
  });

  res.end();
}

function saveAgentEmail(req, res) {
  logger.debug('Inside agent email config save route');

  localData.AGENT_EMAIL.FROM = req.body.from || localData.AGENT_EMAIL.FROM;
  localData.AGENT_EMAIL.RECEIPIENTS = req.body.receipients || localData.AGENT_EMAIL.RECEIPIENTS;
  localData.AGENT_EMAIL.SUBJECT_TEMPLATE =
    req.body.subjectTemplate || localData.AGENT_EMAIL.SUBJECT_TEMPLATE;
  localData.AGENT_EMAIL.BODY_TEMPLATE =
    req.body.bodyTemplate || localData.AGENT_EMAIL.BODY_TEMPLATE;

  return localData.save()
    .then(() => {
      logger.debug('Configuration saved');
      res.status(200);
      res.end();
    })
    .catch(error => {
      res.locals.error('Could not save configuration', true);
      res.end();
      return Promise.reject(error);
    });
}

function loadAgentEmail(req, res) {
  logger.debug('Inside agent email config load route');

  res.status(200).json({
    from: localData.AGENT_EMAIL.FROM,
    receipients: localData.AGENT_EMAIL.RECEIPIENTS,
    subjectTemplate: localData.AGENT_EMAIL.SUBJECT_TEMPLATE,
    bodyTemplate: localData.AGENT_EMAIL.BODY_TEMPLATE
  });

  res.end();
}

module.exports = {
  app: {
    save: saveApp,
    load: loadApp
  },
  agentEmail: {
    save: saveAgentEmail,
    load: loadAgentEmail
  }
};
