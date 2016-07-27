import {
  combineReducers
} from 'redux';
import filesReducer from '../agent-email/files.reducer';
import configReducer from '../agent-email-config/agent-email-config.reducer';
import * as actions from './agent-email.actions';

const initialState = {
  emailSubject: '',
  emailBody: ''
};

function detailsReducer(state = initialState, action) {
  switch (action.type) {
  case actions.UPDATE_EMAIL_BODY:
    return Object.assign({}, state, {
      emailBody: action.body
    });
  case actions.UPDATE_EMAIL_SUBJECT:
    return Object.assign({}, state, {
      emailSubject: action.subject
    });
  default:
    return state;
  }
}

export default combineReducers({
  config: configReducer,
  details: detailsReducer,
  files: filesReducer
});
