if (process.env.NODE_ENV === 'development') {
  module.exports = require('./storeFactory.dev'); // eslint-disable-line
} else {
  module.exports = require('./storeFactory.dist'); // eslint-disable-line
}
