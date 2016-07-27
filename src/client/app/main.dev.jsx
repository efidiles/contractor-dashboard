import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import history from './facades/history';
import routes from './routes';
import storeFactory from './store/storeFactory';
import {THEME} from './config';
import loggerFactory from './utils/logger';

import '../css/main.scss';
import '../img/favicon.ico';

const logger = loggerFactory('From main.dev');

logger.info(`Running in ${process.env.NODE_ENV} environment`);

if (process.env.MOCK_API === 'true') {
  logger.info('Running using the mock api');
}

const store = storeFactory();
const theme = getMuiTheme(THEME);

import DevTools from './components/devtools';

render(
  (<MuiThemeProvider muiTheme={theme}>
    <div>
      <Provider store={store}>
        <Router history={history}>
          {routes}
        </Router>
      </Provider>
      <DevTools store={store} />
    </div>
  </MuiThemeProvider>),
  document.getElementById('root')
);
