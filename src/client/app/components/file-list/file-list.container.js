import {connect} from 'react-redux';

import * as agentEmailActions from '../agent-email/agent-email.actions';
import {AGENT_EMAIL_FILE_TYPE} from '../../config';
import FileList from './file-list.component';

let _dispatch;

function remove(id) {
  _dispatch(agentEmailActions.removeFile(id));
}

function changeFileType(id, newType) {
  _dispatch(agentEmailActions.changeFileType(id, newType));
}

function mapStateToProps(state) {
  return {
    files: state.agentEmail.files,
    fileTypes: Object.keys(AGENT_EMAIL_FILE_TYPE)
  };
}

function mapDispatchToProps(dispatch) {
  _dispatch = dispatch;

  return {
    remove,
    changeFileType
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FileList);

