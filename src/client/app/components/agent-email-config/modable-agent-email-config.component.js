import {connect} from 'react-redux';

import * as appActions from '../app/app.actions';
import * as agentEmailActions from '../agent-email/agent-email.actions';
import makeModable from '../../factories/make-modable';
import loggerFactory from '../../utils/logger';
import AgentEmailConfigComponent from './agent-email-config.container';

const logger = loggerFactory('From modable-agent-email-config.container');
const rootRoute = '/';
let _dispatch;

function onClose() {
  logger.debug('Inside close');

  _dispatch(agentEmailActions.validateData())
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

export default connect(undefined, mapDispatchToProps)(makeModable(AgentEmailConfigComponent));
