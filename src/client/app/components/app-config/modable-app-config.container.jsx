import {connect} from 'react-redux';

import * as appActions from '../app/app.actions';
import makeModable from '../../factories/make-modable';
import AppConfigComponent from '../../components/app-config/app-config.container';
import loggerFactory from '../../utils/logger';

const logger = loggerFactory('From modable-app-config.container');
const rootRoute = '/';
let _dispatch;

function onClose() {
  logger.debug('Inside close');

  _dispatch(appActions.validateData())
    .then(isValid => {
      if (isValid) {
        logger.debug('Data is valid');

        return _dispatch(appActions.redirect(rootRoute));
      }

      logger.debug('Data is invalid');

      return undefined;
    });
}

function mapDispatchToProps(dispatch) {
  _dispatch = dispatch;

  return {
    onClose
  };
}

export default connect(undefined, mapDispatchToProps)(makeModable(AppConfigComponent));
