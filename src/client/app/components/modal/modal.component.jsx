import React, {PropTypes, Component} from 'react';
import classNames from 'classnames';
import FaClose from 'react-icons/lib/fa/close';

import classes from './modal.scss';

export default class Modal extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.element.isRequired,

    onClose: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object
  }

  componentDidMount() {
    this.previousScrollTop = window.pageYOffset;
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    window.scrollTo(0, this.previousScrollTop);
  }

  onCloseClick = () => {
    const {onClose} = this.props;

    onClose();
  }

  render = () => {
    const {className, children} = this.props;
    const rootClass = classNames(classes.root, className);

    return (
      <div className={rootClass}>
        <button
          type="button"
          className={classes.close}
          onClick={this.onCloseClick}
        >
          <FaClose />
        </button>
        <div className={classes.content}>
          {children}
        </div>
      </div>
    );
  }
}
