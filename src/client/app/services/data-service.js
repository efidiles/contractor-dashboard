if (process.env.MOCK_API === 'true') {
  module.exports = require('./data-service.mock'); // eslint-disable-line
} else {
  module.exports = require('./data-service.dist'); // eslint-disable-line
}
