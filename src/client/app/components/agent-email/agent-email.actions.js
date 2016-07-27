import _ from 'lodash';
import path from 'path';

import * as agentEmailConfigActions from '../agent-email-config/agent-email-config.actions';
import * as notificationsActions from '../notifications/notifications.actions';
import * as formData from '../../factories/form-data';
import * as dataService from '../../services/data-service';
import loggerFactory from '../../utils/logger';
import {
  getLastSunday,
  getFileName,
  redirect
} from '../../utils';
import {
  addActionTask,
  removeActionTask,
  addLoadingTask,
  removeLoadingTask,
  reportError
} from '../app/app.actions';
import {
  TIMEOUT_HIDE,
  AGENT_EMAIL_FILE_TYPE,
  NOTIFICATIONS_TYPES,
  NOTIFICATION_THEMES
} from '../../config/constant';

const logger = loggerFactory('From agent-email.actions');

let fileIndex = 1;

const fileDefaults = {
  type: AGENT_EMAIL_FILE_TYPE.TIMESHEET
};

export const ADD_FILE = 'ADD_FILE';
export const REMOVE_FILE = 'REMOVE_FILE';
export const UPDATE_EMAIL_BODY = 'UPDATE_EMAIL_BODY';
export const UPDATE_EMAIL_SUBJECT = 'UPDATE_EMAIL_SUBJECT';
export const CHANGE_AGENCY_FILE_TYPE = 'CHANGE_AGENCY_FILE_TYPE';
export const AGENT_EMAIL_CONFIG_MARK_SUCCESS = 'AGENT_EMAIL_CONFIG_MARK_SUCCESS';
export const AGENT_EMAIL_CONFIG_MARK_FAILURE = 'AGENT_EMAIL_CONFIG_MARK_FAILURE';
export const AGENT_EMAIL_CONFIG_MARK_NONE = 'AGENT_EMAIL_CONFIG_MARK_NONE';
export const AGENT_EMAIL_CONFIG_SET_DATA = 'AGENT_EMAIL_CONFIG_SET_DATA';

const AGENT_EMAIL_LOAD_CONFIG_DATA = 'AGENT_EMAIL_LOAD_CONFIG_DATA';
const AGENT_EMAIL_SAVE_CONFIG_DATA = 'AGENT_EMAIL_SAVE_CONFIG_DATA';
const AGENT_EMAIL_SEND = 'AGENT_EMAIL_SEND';

export const markSuccess = () => ({
  type: AGENT_EMAIL_CONFIG_MARK_SUCCESS
});

export const markFailure = () => ({
  type: AGENT_EMAIL_CONFIG_MARK_FAILURE
});

export const clearStatus = () => ({
  type: AGENT_EMAIL_CONFIG_MARK_NONE
});

export const addFile = file => (dispatch, getState) => {
  const {
    appConfig: {
      firstName,
      lastName
    }
  } = getState();
  const provider = `${firstName} ${lastName}`;
  const ext = path.extname(file.name);
  const name = getFileName(provider, fileDefaults.type) + ext;
  const newFile = _.assign({}, fileDefaults, {
    id: fileIndex++,
    data: file,
    name
  });

  dispatch({
    type: ADD_FILE,
    file: newFile
  });
};

export const removeFile = id => ({
  type: REMOVE_FILE,
  id
});

export const updateEmailBody = body => ({
  type: UPDATE_EMAIL_BODY,
  body
});

export const updateEmailSubject = subject => ({
  type: UPDATE_EMAIL_SUBJECT,
  subject
});

export const changeFileType = (id, fileType) => (dispatch, getState) => {
  const {
    appConfig: {
      firstName,
      lastName
    },
    agentEmail: {
      files
    }
  } = getState();

  const provider = `${firstName} ${lastName}`;
  const file = _.find(files, {
    id
  });
  const ext = path.extname(file.name);
  const name = getFileName(provider, fileType) + ext;

  dispatch({
    type: CHANGE_AGENCY_FILE_TYPE,
    id,
    name,
    fileType
  });
};

export const setConfigData = data => Object.assign({}, data, {
  type: AGENT_EMAIL_CONFIG_SET_DATA
});

export const parseEmailData = () => (dispatch, getState) => {
  const lastSunday = getLastSunday();

  const {
    appConfig: {
      firstName,
      lastName,
      companyName
    },
    agentEmail
  } = getState();

  const fullName = `${firstName} ${lastName}`;

  const subject = _.template(agentEmail.config.subjectTemplate)({
    company: companyName,
    period: _.kebabCase(lastSunday),
    name: fullName
  });

  // TODO: add invoice parameter
  const body = _.template(agentEmail.config.bodyTemplate)({
    invoice: '',
    period: lastSunday,
    name: fullName
  });

  dispatch(updateEmailSubject(subject));
  dispatch(updateEmailBody(body));

  return Promise.resolve();
};

export const send = () => (dispatch, getStore) => {
  logger.debug('Inside send');

  const {
    agentEmail: {
      details: {
        emailSubject,
        emailBody
      },
      config: {
        receipients
      },
      files
    }
  } = getStore();

  dispatch(addActionTask(AGENT_EMAIL_SEND));

  const emailBodyHtml = emailBody.replace(/(?:\r\n|\r|\n)/g, '<br>');
  logger.trace('emailBodyHtml', emailBodyHtml);

  logger.debug('Creating form data');

  const form = formData.create();
  form.append('to', receipients);
  form.append('subject', emailSubject);
  form.append('content', emailBodyHtml);

  _.map(files, attachment => {
    logger.debug('Attaching file', attachment.name);
    form.append('files', attachment.data, attachment.name);
  });

  return dataService
    .sendAgentEmail(form.data())
    .then(() => {
      logger.debug('Data sent successfully');

      dispatch(removeActionTask(AGENT_EMAIL_SEND));

      dispatch(notificationsActions.addClosing(
        NOTIFICATIONS_TYPES.EMAIL_SENT_SUCCESS,
        'Email sent successfully',
        NOTIFICATION_THEMES.SUCCESS
      ));
    })
    .catch(response => {
      logger.debug('Error sending data');
      logger.trace('response', response);

      if (response.status === 401) {
        logger.debug('Authorisation failed. Redirecting to', response.data.url);

        dispatch(removeActionTask(AGENT_EMAIL_SEND));
        redirect(response.data.url);
      }

      dispatch(reportError(response.data.message));
      dispatch(removeActionTask(AGENT_EMAIL_SEND));

      dispatch(notificationsActions.addClosing(
        NOTIFICATIONS_TYPES.EMAIL_SENT_FAILED,
        'Email could not be sent',
        NOTIFICATION_THEMES.DANGER
      ));
    });
};

export const loadData = () => dispatch => {
  logger.debug('Inside loadData');

  dispatch(addLoadingTask(AGENT_EMAIL_LOAD_CONFIG_DATA));

  logger.debug('Calling dataService.getAgentEmailConfig');
  return dataService
    .getAgentEmailConfig()
    .then(response => {
      logger.debug('getAgentEmailConfig completed successfully');

      dispatch(setConfigData(response.data));
      dispatch(parseEmailData());
      dispatch(removeLoadingTask(AGENT_EMAIL_LOAD_CONFIG_DATA));

      return response.data;
    })
    .catch(error => {
      logger.debug('getAgentEmailConfig failed', error);

      dispatch(removeLoadingTask(AGENT_EMAIL_LOAD_CONFIG_DATA));
      dispatch(reportError('Failed fetching agent email config'));
    });
};


export const validateData = () => dispatch => {
  logger.debug('Validating agent email config data');

  return dispatch(agentEmailConfigActions.isValidAgentEmailConfig())
    .then(isValid => {
      dispatch(notificationsActions.clear(NOTIFICATIONS_TYPES.INVALID_AGENT_EMAIL_CONFIGURATION));

      if (!isValid) {
        logger.debug('Invalid application configuration');

        dispatch(notificationsActions.add(
          NOTIFICATIONS_TYPES.INVALID_AGENT_EMAIL_CONFIGURATION,
          'Invalid agent email configuration. Please enter valid parameters'
        ));
      }

      return Promise.resolve(isValid);
    });
};

// TODO: move to agent-email-config.actions
export const saveData = data => dispatch => {
  dispatch(addActionTask(AGENT_EMAIL_SAVE_CONFIG_DATA));

  return dataService
    .saveAgentEmailConfig(data)
    .then(() => {
      dispatch(markSuccess());
      dispatch(removeActionTask(AGENT_EMAIL_SAVE_CONFIG_DATA));
      dispatch(setConfigData(data));
      dispatch(validateData());
      dispatch(parseEmailData());

      setTimeout(_clearStatus, TIMEOUT_HIDE);

      function _clearStatus() {
        dispatch(clearStatus());
      }
    })
    .catch(() => {
      dispatch(markFailure());
      dispatch(removeActionTask(AGENT_EMAIL_SAVE_CONFIG_DATA));
      setTimeout(_clearStatus, TIMEOUT_HIDE);

      function _clearStatus() {
        dispatch(clearStatus());
      }
    });
};
