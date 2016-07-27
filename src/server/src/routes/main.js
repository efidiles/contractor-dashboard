const localData = require('../utils/local-data');
const logger = require('../decorators/logger')('From main router');

function root(req, res) {
  logger.debug('Inside root route');

  res.writeHeader(200, {
    'Content-Type': 'text/html'
  });

  res.write('Great! The API is working.');

  return res.end();
}

function test(req, res) {
  if (res.app.locals.token) {
    localData.token = res.app.locals.token;
  }

  localData
    .save()
    .then(() => {
      res.locals.success(localData);
    });
}

module.exports = {
  root,
  test
};
