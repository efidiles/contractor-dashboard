import {connect} from 'react-redux';

import loggerFactory from '../../utils/logger';

import * as appActions from './app.actions';
import App from './app.component';

const logger = loggerFactory('From app.container');
const appConfigRoute = '/config/app';
let _dispatch;

function validateData(props) {
  logger.debug('Inside validateData');

  const {location} = props;

  if (isAppConfigRoute()) {
    logger.debug('On app config data route - no validation required');
    return Promise.resolve(true);
  }

  return _dispatch(appActions.validateData())
    .then(isValid => {
      if (!isValid) {
        logger.debug('Redirecting to app config route');

        return _dispatch(appActions.redirect(appConfigRoute));
      }

      return Promise.resolve();
    });

  function isAppConfigRoute() {
    logger.debug('Inside isAppConfigRoute');
    logger.trace('location.pathname', location.pathname);
    logger.trace('appConfigRoute', appConfigRoute);

    return location.pathname === appConfigRoute;
  }
}

function loadData() {
  logger.debug('Inside loadData');

  return _dispatch(appActions.loadData());
}

function mapStateToProps(state) {
  const {dataLoaded, actionTasks, loadingTasks} = state.appState;

  return {
    dataLoaded,
    showNonIntrusiveSpinner: !!actionTasks.length,
    showIntrusiveSpinner: !!loadingTasks.length
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  _dispatch = dispatch;

  return {
    loadData,
    validateData: validateData.bind(null, ownProps)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
