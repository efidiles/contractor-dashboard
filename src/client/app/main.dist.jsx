import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, hashHistory} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import routes from './routes';
import storeFactory from './store/storeFactory';
import {THEME} from './config';

import '../css/main.scss';
import '../img/favicon.ico';

const store = storeFactory();
const theme = getMuiTheme(THEME);

render(
  (<MuiThemeProvider muiTheme={theme}>
    <div>
      <Provider store={store}>
        <Router history={hashHistory} routes={routes}>
          {routes}
        </Router>
      </Provider>
    </div>
  </MuiThemeProvider>),
  document.getElementById('root')
);
