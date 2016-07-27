import {connect} from 'react-redux';

import * as agentEmailActions from '../agent-email/agent-email.actions';
import AgentEmailConfig from
  './agent-email-config.component';

let _dispatch;

function saveData(data) {
  _dispatch(agentEmailActions.saveData(data));
}

function loadData() {
  _dispatch(agentEmailActions.loadData());
}

function mapStateToProps(state) {
  return state.agentEmail.config;
}

function mapDispatchToProps(dispatch) {
  _dispatch = dispatch;

  return {
    loadData,
    saveData
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgentEmailConfig);
