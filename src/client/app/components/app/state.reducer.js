import {
  ADD_ACTION_TASK,
  REMOVE_ACTION_TASK,
  ADD_LOADING_TASK,
  REMOVE_LOADING_TASK,
  INITIAL_DATA_LOADED
} from './app.actions';

import _ from 'lodash';

const _defaultState = {
  dataLoaded: false,
  actionTasks: [],
  loadingTasks: []
};

export default (state = _defaultState, action) => {
  switch (action.type) {
  case INITIAL_DATA_LOADED:
    return Object.assign({}, state, {
      dataLoaded: true
    });
  case ADD_ACTION_TASK:
    return Object.assign({}, state, {
      actionTasks: [...state.actionTasks, action.name]
    });
  case REMOVE_ACTION_TASK:
    return Object.assign({}, state, {
      actionTasks: _.without(state.actionTasks, action.name)
    });
  case ADD_LOADING_TASK:
    return Object.assign({}, state, {
      loadingTasks: [...state.loadingTasks, action.name]
    });
  case REMOVE_LOADING_TASK:
    return Object.assign({}, state, {
      loadingTasks: _.without(state.loadingTasks, action.name)
    });
  default:
    return state;
  }
};
