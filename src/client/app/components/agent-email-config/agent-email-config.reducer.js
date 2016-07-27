import {
  AGENT_EMAIL_CONFIG_MARK_SUCCESS,
  AGENT_EMAIL_CONFIG_MARK_FAILURE,
  AGENT_EMAIL_CONFIG_SET_DATA,
  AGENT_EMAIL_CONFIG_MARK_NONE
} from '../agent-email/agent-email.actions';

import {
  STATUS
} from '../../config/constant';

const _defaultState = {
  status: STATUS.NONE,
  title: 'Agent email configuration',
  dataLoaded: false
};

export default (state = _defaultState, action) => {
  switch (action.type) {
  case AGENT_EMAIL_CONFIG_SET_DATA:
    {
      const newState = Object.assign({}, action);
      delete newState.type;

      return Object.assign({}, state, newState, {
        dataLoaded: true
      });
    }

  case AGENT_EMAIL_CONFIG_MARK_SUCCESS:
    {
      return Object.assign({}, state, {
        status: STATUS.SUCCESS
      });
    }

  case AGENT_EMAIL_CONFIG_MARK_FAILURE:
    {
      return Object.assign({}, state, {
        status: STATUS.FAILURE
      });
    }

  case AGENT_EMAIL_CONFIG_MARK_NONE:
    {
      return Object.assign({}, state, {
        status: STATUS.NONE
      });
    }

  default:
    {
      return state;
    }
  }
};
