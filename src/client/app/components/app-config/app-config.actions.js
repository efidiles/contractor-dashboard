import * as dataService from '../../services/data-service';
import configFactory from '../../factories/app-config';
import * as agentEmailActions from '../agent-email/agent-email.actions';
import loggerFactory from '../../utils/logger';
import {
  addActionTask,
  addLoadingTask,
  removeActionTask,
  removeLoadingTask,
  reportError,
  validateData
} from '../app/app.actions';
import {
  TIMEOUT_HIDE
} from '../../config/constant';

const logger = loggerFactory('From app-config.actions');

const LOAD_APP_CONFIG_DATA = 'LOAD_APP_CONFIG_DATA';
const SAVE_APP_CONFIG_DATA = 'SAVE_APP_CONFIG_DATA';

export const APP_CONFIG_MARK_SUCCESS = 'APP_CONFIG_MARK_SUCCESS';
export const APP_CONFIG_MARK_FAILURE = 'APP_CONFIG_MARK_FAILURE';
export const APP_CONFIG_MARK_NONE = 'APP_CONFIG_MARK_NONE';
export const APP_CONFIG_SET_DATA = 'APP_CONFIG_SET_DATA';

export const markSuccess = () => ({
  type: APP_CONFIG_MARK_SUCCESS
});

export const markFailure = () => ({
  type: APP_CONFIG_MARK_FAILURE
});

export const clearStatus = () => ({
  type: APP_CONFIG_MARK_NONE
});

export const setData = data => Object.assign({}, data, {
  type: APP_CONFIG_SET_DATA
});

export const saveData = data => {
  logger.debug('Inside saveData');

  const {
    firstName,
    lastName,
    companyName,
    clientId,
    clientSecret,
    redirectUrl
  } = data;

  const newData = {
    firstName,
    lastName,
    companyName,
    googleApiId: clientId,
    googleApiSecret: clientSecret,
    googleApiRedirectUrl: redirectUrl
  };

  return dispatch => {
    dispatch(addActionTask(SAVE_APP_CONFIG_DATA));

    dataService.saveAppConfig(newData)
      .then(() => {
        dispatch(markSuccess());
        dispatch(removeActionTask(SAVE_APP_CONFIG_DATA));
        dispatch(setData(data));
        dispatch(validateData());
        dispatch(agentEmailActions.parseEmailData());

        setTimeout(() => dispatch(clearStatus()), TIMEOUT_HIDE);
      })
      .catch(() => {
        dispatch(markFailure());
        dispatch(removeActionTask(SAVE_APP_CONFIG_DATA));
        dispatch(reportError('Could not save the configuration data'));

        setTimeout(() => dispatch(clearStatus()), TIMEOUT_HIDE);
      });
  };
};

export const loadData = () => dispatch => {
  logger.debug('Inside loadData');

  dispatch(addLoadingTask(LOAD_APP_CONFIG_DATA));

  logger.debug('Calling dataService.getAppConfig');

  return dataService.getAppConfig()
    .then(response => {
      logger.debug('getAppConfig completed successfully');

      const configData = configFactory(response.data);
      dispatch(removeLoadingTask(LOAD_APP_CONFIG_DATA));
      dispatch(setData(configData));
      dispatch(agentEmailActions.parseEmailData());

      return configData;
    })
    .catch(error => {
      logger.debug('getAppConfig failed', error);

      dispatch(removeLoadingTask(LOAD_APP_CONFIG_DATA));
      dispatch(reportError('Failed fetching app config data'));
    });
};

export const isValidAppConfig = () => (dispatch, getState) => {
  const state = getState();
  const appConfig = state.appConfig;

  return Promise.resolve(
    appConfig.firstName &&
    appConfig.lastName &&
    appConfig.companyName &&
    appConfig.clientId &&
    appConfig.clientSecret &&
    appConfig.redirectUrl
  );
};
