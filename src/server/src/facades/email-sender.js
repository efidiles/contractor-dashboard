const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const Promise = require('bluebird');
const _ = require('lodash');

const localData = require('../utils/local-data');
const logger = require('../decorators/logger')('From email sender');

let gmailSender;


function saveToken(token) {
  logger.debug('Saving token');

  localData.TOKEN.access_token = token.accessToken;
  localData.save();
}

function performGoogleAuthentication() {
  logger.debug('Inside performGoogleAuthentication');

  if (!_.get(localData, 'AGENT_EMAIL.FROM')) {
    throw new Error('Missing sender email');
  }

  if (!_.get(localData, 'CREDENTIALS.ID')) {
    throw new Error('Missing Google API ID');
  }

  if (!_.get(localData, 'CREDENTIALS.SECRET')) {
    throw new Error('Missing Google API secret');
  }

  if (!_.get(localData, 'TOKEN.refresh_token')) {
    throw new Error('Missing refresh token');
  }

  if (!_.get(localData, 'TOKEN.access_token')) {
    throw new Error('Missing access token');
  }

  const generator = xoauth2.createXOAuth2Generator({
    user: _.get(localData, 'AGENT_EMAIL.FROM'),
    clientId: _.get(localData, 'CREDENTIALS.ID'),
    clientSecret: _.get(localData, 'CREDENTIALS.SECRET'),
    refreshToken: _.get(localData, 'TOKEN.refresh_token'),
    accessToken: _.get(localData, 'TOKEN.access_token')
  });

  generator.on('token', saveToken);

  return generator;
}

function loadConfig() {
  logger.debug('Inside loadConfig');

  const authentication = performGoogleAuthentication();

  gmailSender = Promise.promisifyAll(
    nodemailer.createTransport({
      service: 'gmail',
      auth: {
        xoauth2: authentication
      }
    })
  );
}

function sendEmail(to, subject, content, files) {
  logger.debug('Inside sendEmail');

  if (!gmailSender) {
    loadConfig();
  }

  if (!_.get(localData, 'AGENT_EMAIL.FROM')) {
    throw new Error('Missing sender email');
  }

  if (!_.get(to, 'length')) {
    throw new Error('Missing destination email');
  }

  if (!_.get(subject, 'length')) {
    throw new Error('Missing subject');
  }

  if (!_.get(content, 'length')) {
    throw new Error('Missing content');
  }

  const attachments = _.map(files, file => ({
    filename: file.originalname,
    path: file.path
  }));

  const emailOptions = {
    from: localData.AGENT_EMAIL.FROM,
    html: content,
    to,
    subject
  };

  if (attachments.length) {
    emailOptions.attachments = attachments;
  }

  return gmailSender.sendMailAsync(emailOptions);
}

module.exports = {
  sendEmail,
  loadConfig
};
