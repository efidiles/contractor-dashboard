import React from 'react';

const css = {
  slider: {
    height: '3px',
    width: '100%',
    overflow: 'hidden',
    position: 'fixed',
    zIndex: 3
  },
  line: {
    position: 'absolute',
    background: '#00838f',
    width: '100%',
    height: '3px'
  },
  break: {
    position: 'absolute',
    background: '#87f5ff',
    height: '3px'
  },
  dot1: {
    width: '80px',
    animation: 'loading 4s infinite',
    WebkitAnimation: 'loading 4s infinite',
    transform: 'translateZ(0)'
  },
  dot2: {
    width: '30px',
    animation: 'loading 4s 2s infinite',
    WebkitAnimation: 'loading 4s 2s infinite',
    transform: 'translateZ(0)'
  },
  dot3: {
    width: '110px',
    animation: 'loading 4s 1s infinite',
    WebkitAnimation: 'loading 4s 1s infinite',
    transform: 'translateZ(0)'
  }
};

Object.assign(css.dot1, css.break);
Object.assign(css.dot2, css.break);
Object.assign(css.dot3, css.break);

export default () => (
  <div style={css.slider}>
    <div style={css.line}></div>
    <div style={css.dot1}></div>
    <div style={css.dot2}></div>
    <div style={css.dot3}></div>
  </div>
);
