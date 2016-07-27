import {TIMEOUT_HIDE} from '../../config/constant';
import loggerFactory from '../../utils/logger';

const logger = loggerFactory('From notifications.actions');

export const NOTIFICATIONS_ADD = 'NOTIFICATIONS_ADD';
export const NOTIFICATIONS_REMOVE = 'NOTIFICATIONS_REMOVE';
export const NOTIFICATIONS_CLEAR = 'NOTIFICATIONS_CLEAR';

let autoCloseNotificationId = -1;

export const add = (notificationType, description, notificationTheme, id) => {
  logger.debug('Inside add');

  return {
    id,
    type: NOTIFICATIONS_ADD,
    notificationTheme,
    notificationType,
    description
  };
};

export const remove = id => {
  logger.debug('Inside remove');

  return {
    type: NOTIFICATIONS_REMOVE,
    id
  };
};

export const clear = notificationType => {
  logger.debug('Inside clear');

  return {
    type: NOTIFICATIONS_CLEAR,
    notificationType
  };
};

export const addClosing = (notificationType, description, notificationTheme) => {
  logger.debug('Inside addClosing');

  const id = autoCloseNotificationId--;

  setTimeout(() => remove(id), TIMEOUT_HIDE);

  return {
    id,
    type: NOTIFICATIONS_ADD,
    notificationTheme,
    notificationType,
    description
  };
};
