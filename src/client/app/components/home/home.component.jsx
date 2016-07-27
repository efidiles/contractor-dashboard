import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import classNames from 'classnames';

import AgentEmail from '../../components/agent-email/agent-email.container';
import Sidebar from '../sidebar/sidebar.component';

import classes from './home.scss';

export default function Home(props) {
  const {className, location} = props;
  const rootClass = classNames(classes.root, className);

  return (
    <div className={rootClass}>
      <Paper className={classes.panel} zDepth={1}>
        <AgentEmail location={location} />
      </Paper>
      <Sidebar />
    </div>
  );
}

Home.propTypes = {
  className: PropTypes.string,
  location: PropTypes.object
};
