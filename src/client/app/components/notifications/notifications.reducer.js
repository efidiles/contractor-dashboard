import _ from 'lodash';

import {
  NOTIFICATIONS_CLOSE,
  NOTIFICATIONS_ADD,
  NOTIFICATIONS_CLEAR
} from './notifications.actions';

import loggerFactory from '../../utils/logger';

const logger = loggerFactory('From notifications.reducer');
let nId = 0;

export default (state = [], action) => {
  logger.trace('state', state);

  const {
    type,
    description,
    notificationType,
    notificationTheme,
    id
  } = action;

  switch (type) {
  case NOTIFICATIONS_CLOSE:
    {
      logger.debug('Intercepted NOTIFICATIONS_CLOSE');
      logger.trace('action', action);

      const newState = _.reject(state, {
        id
      });

      logger.trace('newState', newState);

      return newState;
    }

  case NOTIFICATIONS_ADD:
    {
      logger.debug('Intercepted NOTIFICATIONS_ADD');
      logger.trace('action', action);

      const newState = [...state, {
        id: id || nId++,
        description,
        notificationType,
        notificationTheme
      }];

      logger.trace('newState', newState);

      return newState;
    }

  case NOTIFICATIONS_CLEAR:
    {
      logger.debug('Intercepted NOTIFICATIONS_CLEAR');
      logger.trace('action', action);

      const newState = _.reject(state, {
        notificationType
      });

      logger.trace('newState', newState);

      return newState;
    }

  default:
    {
      return state;
    }
  }
};
