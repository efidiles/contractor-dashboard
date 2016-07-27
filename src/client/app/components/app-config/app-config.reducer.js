import {
  APP_CONFIG_MARK_SUCCESS,
  APP_CONFIG_MARK_FAILURE,
  APP_CONFIG_MARK_NONE,
  APP_CONFIG_SET_DATA
} from './app-config.actions';

import {
  ADD_LOADING_TASK
} from '../app/app.actions';

import {
  STATUS
} from '../../config/constant';

const _defaultState = {
  status: STATUS.NONE,
  dataLoaded: false,
  messages: undefined,
  title: 'App configuration',
  firstName: undefined,
  lastName: undefined,
  companyName: undefined,
  clientId: undefined,
  clientSecret: undefined,
  redirectUrl: 'http://localhost:8066/auth/callback'
};

export default (state = _defaultState, action) => {
  let newState;

  switch (action.type) {
  case APP_CONFIG_SET_DATA:
    {
      const {
        firstName,
        lastName,
        companyName,
        clientId,
        clientSecret,
        redirectUrl
      } = action;

      newState = {
        firstName,
        lastName,
        companyName,
        clientId,
        clientSecret,
        redirectUrl
      };

      return Object.assign({}, state, newState, {
        dataLoaded: true
      });
    }

  case APP_CONFIG_MARK_SUCCESS:
    {
      return Object.assign({}, state, {
        status: STATUS.SUCCESS
      });
    }

  case APP_CONFIG_MARK_FAILURE:
    {
      return Object.assign({}, state, {
        status: STATUS.FAILURE
      });
    }

  case APP_CONFIG_MARK_NONE:
    {
      return Object.assign({}, state, {
        status: STATUS.NONE
      });
    }

  case ADD_LOADING_TASK:
    {
      newState = Object.assign({}, action);
      delete newState.type;
      return Object.assign({}, state, newState);
    }

  default:
    {
      return state;
    }
  }
};
