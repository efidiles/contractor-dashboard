/**
 * This is a file which makes sense only when is compiled via webpack
 */

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./main.dev'); // eslint-disable-line
} else {
  module.exports = require('./main.dist'); // eslint-disable-line
}
