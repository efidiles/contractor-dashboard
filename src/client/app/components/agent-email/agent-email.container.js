import {
  connect
} from 'react-redux';

import loggerFactory from '../../utils/logger';
import * as appActions from '../app/app.actions';

import * as agentEmailActions from './agent-email.actions';
import AgentEmail from './agent-email.component';

const logger = loggerFactory('From agent-email.container');
const agentEmailConfigRoute = '/config/agent-email';
let _dispatch;

function send() {
  logger.debug('Inside send');

  _dispatch(agentEmailActions.send());
}

function validateData(props) {
  logger.debug('Inside validateData');

  const {location} = props;

  if (isAgentEmailConfigRoute()) {
    logger.debug('On app config data route - no validation required');
    return Promise.resolve(true);
  }

  /**
   * Don't do anything if app config data is invalid as
   * we want the user to set the app data config first
   */
  return validateAppData()
      .then(isAppDataValid => {
        if (isAppDataValid) {
          return validateAgentEmailData();
        }

        return Promise.resolve();
      });

  function validateAppData() {
    logger.debug('Inside validateAppData');

    return _dispatch(appActions.validateData());
  }

  function validateAgentEmailData() {
    logger.debug('Inside validateAgentEmailData');

    return _dispatch(agentEmailActions.validateData())
      .then(isValid => {
        if (!isValid) {
          logger.debug('Redirecting to agent email config route');

          return _dispatch(appActions.redirect(agentEmailConfigRoute));
        }

        return Promise.resolve();
      });
  }

  function isAgentEmailConfigRoute() {
    logger.debug('Inside isAgentEmailConfigRoute');
    logger.trace('location.pathname', location.pathname);
    logger.trace('agentEmailConfigRoute', agentEmailConfigRoute);

    return location.pathname === agentEmailConfigRoute;
  }
}

function loadData() {
  logger.debug('Inside loadData');

  return _dispatch(agentEmailActions.loadData());
}

function onDrop(files) {
  files.map(file => _dispatch(agentEmailActions.addFile(file)));
}

function onBodyChange(body) {
  _dispatch(agentEmailActions.updateEmailBody(body));
}

function onSubjectChange(subject) {
  _dispatch(agentEmailActions.updateEmailSubject(subject));
}

function mapStateToProps(state) {
  const {
    agentEmail
  } = state;

  return {
    dataLoaded: agentEmail.config.dataLoaded,
    subject: agentEmail.details.emailSubject,
    body: agentEmail.details.emailBody,
    hasFiles: agentEmail.files.length > 0
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  _dispatch = dispatch;

  return {
    loadData,
    onDrop,
    onBodyChange,
    onSubjectChange,
    send,
    validateData: validateData.bind(null, ownProps)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgentEmail);
