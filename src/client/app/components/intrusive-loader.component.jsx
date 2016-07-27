import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const style = {
  container: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: '#fff',
    zIndex: 2
  },
  progress: {
    position: 'absolute',
    margin: 0,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
};

export default () => (
  <div style={style.container}>
    <CircularProgress style={style.progress} size={2} />
  </div>
);
