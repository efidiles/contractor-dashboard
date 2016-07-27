import {connect} from 'react-redux';

import FileListSimple from './file-list-simple.component';

function mapStateToProps(state) {
  return {
    files: state.agentEmail.files
  };
}

export default connect(mapStateToProps, null)(FileListSimple);
