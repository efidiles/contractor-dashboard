import {createStore, compose, applyMiddleware} from 'redux';
import {persistState} from 'redux-devtools';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import DevTools from '../components/devtools';
import rootReducer from './rootReducer';

const logger = createLogger({
  collapsed: true
});

const finalCreateStore = compose(
  applyMiddleware(thunk, logger),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument(),
  // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
  persistState(getDebugSessionKey())
)(createStore);

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0) ? matches[1] : null;
}

export default function configureStore() {
  return finalCreateStore(
    rootReducer
  );
}
