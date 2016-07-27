import {connect} from 'react-redux';

import * as notificationsActions from './notifications.actions';
import Notifications from './notifications.component';
import loggerFactory from '../../utils/logger';

const logger = loggerFactory('From notifications.container');
let _dispatch;

function mapStateToProps(state) {
  logger.debug('Inside mapStateToProps');
  logger.trace('state.notifications', state.notifications);

  return {
    notifications: state.notifications
  };
}

function mapDispatchToProps(dispatch) {
  _dispatch = dispatch;

  return {
    close
  };
}

function close() {
  _dispatch(notificationsActions.close());
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
