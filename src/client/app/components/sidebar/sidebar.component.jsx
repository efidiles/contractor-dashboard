import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import FaEllipsisV from 'react-icons/lib/fa/ellipsis-v';
import classNames from 'classnames';

import classes from './sidebar.scss';

const Sidebar = props => {
  const {className} = props;
  const rootClass = classNames(classes.root, className);

  return (
    <ul className={rootClass}>
      <li>
        <Link
          className={classes.configLink}
          to={{
            pathname: '/config/app'
          }}
        >
          <FaEllipsisV />
        </Link>
      </li>
      <li></li>
    </ul>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string
};

export default Sidebar;

