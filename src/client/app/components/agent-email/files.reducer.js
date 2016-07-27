import {findIndex, assign} from 'lodash';
import {ADD_FILE, REMOVE_FILE, CHANGE_AGENCY_FILE_TYPE} from './agent-email.actions';

export default (state = [], action) => {
  if (action.type === ADD_FILE) {
    return _addFile(state, action);
  }

  if (action.type === REMOVE_FILE) {
    return _removeFile(state, action);
  }

  if (action.type === CHANGE_AGENCY_FILE_TYPE) {
    return _updateFileType(state, action);
  }

  return state;
};

// Private declarations

function _addFile(state, action) {
  return [...state, action.file];
}

function _removeFile(state, action) {
  const indexOfFile = findIndex(state, {
    id: action.id
  });
  return [
    ...state.slice(0, indexOfFile),
    ...state.slice(indexOfFile + 1)
  ];
}

function _updateFileType(state, action) {
  const indexOfFile = findIndex(state, {
    id: action.id
  });
  const file = state[indexOfFile];
  const newFile = assign({}, file, {
    name: action.name,
    type: action.fileType
  });

  return [
    ...state.slice(0, indexOfFile),
    newFile,
    ...state.slice(indexOfFile + 1)
  ];
}
