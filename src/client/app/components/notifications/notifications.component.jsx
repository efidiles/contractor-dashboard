import React, {PropTypes} from 'react';
import classNames from 'classnames';

import loggerFactory from '../../utils/logger';
import classes from './notifications.scss';

const logger = loggerFactory('From notifications.component');

const Notifications = props => {
  const {className, notifications} = props;
  const rootClass = classNames(classes.root, className);
  let content = null;

  logger.debug('Inside render');
  logger.trace('props', props);

  if (notifications.length) {
    content = (
      <div className={rootClass}>
        <ul className={classes.content}>
            {notifications.map(
              (notification, index) => (
                <li
                  className={classes[notification.notificationTheme.toLowerCase()]}
                  key={index}
                >
                  {notification.description}
                </li>
              ))
            }
        </ul>
      </div>
    );
  }

  return content;
};

Notifications.propTypes = {
  className: PropTypes.string,
  notifications: PropTypes.array
};

export default Notifications;
