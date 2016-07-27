import React, {PropTypes} from 'react';

import Modal from '../components/modal/modal.component';

export default WrappedComponent => {
  function ModalComponent(props) {
    return (
      <Modal {...props}>
        <WrappedComponent />
      </Modal>
    );
  }

  ModalComponent.propTypes = {
    location: PropTypes.object
  };

  return ModalComponent;
};
