import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

const finalCreateStore = compose()(createStore);

export default function configureStore() {
  return finalCreateStore(
    rootReducer,
    applyMiddleware(thunk)
  );
}
