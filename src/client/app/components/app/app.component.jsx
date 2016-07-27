import React, {Component, PropTypes} from 'react';

import BusyLine from '../busy-line.component';

import IntrusiveLoader from '../intrusive-loader.component';
import Notifications from '../../components/notifications/notifications.container';
import loggerFactory from '../../utils/logger';

const logger = loggerFactory('From app.component');

export default class App extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    dataLoaded: PropTypes.bool,
    showNonIntrusiveSpinner: PropTypes.bool,
    showIntrusiveSpinner: PropTypes.bool,
    location: PropTypes.object,

    loadData: PropTypes.func.isRequired,
    validateData: PropTypes.func.isRequired
  }

  componentWillMount() {
    const {
      dataLoaded,

      loadData,
      validateData
    } = this.props;

    if (!dataLoaded) {
      logger.debug('Data not loaded');

      loadData().then(validateData);
    } else {
      logger.debug('Data loaded');

      validateData();
    }
  }

  render() {
    const {
      children,
      dataLoaded,
      showNonIntrusiveSpinner,
      showIntrusiveSpinner
    } = this.props;
    const notifications = <Notifications />;
    let mainContent = <main>{children}</main>;
    let loader = false;

    if (!dataLoaded || showIntrusiveSpinner) {
      return (
        <div>
          <IntrusiveLoader />
        </div>
      );
    }

    if (showNonIntrusiveSpinner) {
      loader = <BusyLine />;
    }

    return (
      <div>
        {loader}
        {notifications}
        {mainContent}
      </div>
    );
  }
}
