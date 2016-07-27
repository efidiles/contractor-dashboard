import {connect} from 'react-redux';

import * as appConfigActions from './app-config.actions';
import AppConfig from './app-config.component';

let _dispatch;

function loadData() {
  _dispatch(appConfigActions.loadData());
}

function saveData(data) {
  _dispatch(appConfigActions.saveData(data));
}

function mapStateToProps(state) {
  return state.appConfig;
}

function mapDispatchToProps(dispatch) {
  _dispatch = dispatch;

  return {
    loadData,
    saveData
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppConfig);
