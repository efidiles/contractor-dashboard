import {combineReducers} from 'redux';
import agentEmail from '../components/agent-email/agent-email.reducer';
import appConfig from '../components/app-config/app-config.reducer';
import notifications from '../components/notifications/notifications.reducer';
import appState from '../components/app/state.reducer';

export default combineReducers({
  agentEmail,
  appConfig,
  appState,
  notifications
});
