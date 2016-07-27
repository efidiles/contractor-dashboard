import * as appConfigActions from '../app-config/app-config.actions';
import locationHistory from '../../facades/history';
import loggerFactory from '../../utils/logger';
import {NOTIFICATIONS_TYPES} from '../../config';
import * as notificationsActions from '../notifications/notifications.actions';

const logger = loggerFactory('From app-actions');

export const ADD_ACTION_TASK = 'ADD_ACTION_TASK';
export const REMOVE_ACTION_TASK = 'REMOVE_ACTION_TASK';
export const ADD_LOADING_TASK = 'ADD_LOADING_TASK';
export const REMOVE_LOADING_TASK = 'REMOVE_LOADING_TASK';
export const INITIAL_DATA_LOADED = 'INITIAL_DATA_LOADED';

const LOAD_INITIAL_APP_DATA = 'LOAD_INITIAL_APP_DATA';

export const addActionTask = name => ({
  type: ADD_ACTION_TASK,
  name
});

export const removeActionTask = name => ({
  type: REMOVE_ACTION_TASK,
  name
});

export const addLoadingTask = name => ({
  type: ADD_LOADING_TASK,
  name
});

export const removeLoadingTask = name => ({
  type: REMOVE_LOADING_TASK,
  name
});

export const initialDataLoaded = () => ({
  type: INITIAL_DATA_LOADED
});

export const reportError = message =>
  () => {
    // TODO: must implement reportError
    console.warn(message); //eslint-disable-line
  };

export const loadData = () =>
  dispatch => {
    logger.debug('Inside loadData');

    dispatch(addLoadingTask(LOAD_INITIAL_APP_DATA));

    return dispatch(appConfigActions.loadData())
      .then(() => {
        logger.debug('All data loaded successfully');

        dispatch(initialDataLoaded());
        dispatch(removeLoadingTask(LOAD_INITIAL_APP_DATA));
      })
      .catch(() => {
        logger.debug('Data loading failed');

        dispatch(removeLoadingTask(LOAD_INITIAL_APP_DATA));
        dispatch(reportError('Failed to load initialisation data'));
      });
  };

export const redirect = route => () => {
  logger.debug(`Redirecting to ${route}`);

  locationHistory.replace(route);

  return Promise.resolve();
};

export const validateData = () => dispatch => {
  logger.debug('Validating app config data');

  return dispatch(appConfigActions.isValidAppConfig())
    .then(isValid => {
      dispatch(notificationsActions.clear(NOTIFICATIONS_TYPES.INVALID_APP_CONFIGURATION));

      if (!isValid) {
        logger.debug('Invalid application configuration');

        dispatch(notificationsActions.add(
          NOTIFICATIONS_TYPES.INVALID_APP_CONFIGURATION,
          'Invalid application configuration. Please enter valid parameters'
        ));
      }

      return Promise.resolve(isValid);
    });
};
