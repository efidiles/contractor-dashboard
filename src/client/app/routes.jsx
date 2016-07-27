import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './components/app/app.container';
import ModableAppConfig from './components/app-config/modable-app-config.container';
import Home from './components/home/home.component';
import ModableAgentEmailConfig from
  './components/agent-email-config/modable-agent-email-config.component';

export default(
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="config">
      <Route path="app" component={ModableAppConfig} />
      <Route path="agent-email" component={ModableAgentEmailConfig} />
    </Route>
  </Route>
);
