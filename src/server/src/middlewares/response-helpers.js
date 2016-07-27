const logger = require('../decorators/logger')('From response helpers');

function error(res, statusCode, message, log) {
  if (log) {
    logger.debug(message);
  }

  const body = {
    message
  };

  res.status(statusCode).json(body);
}

function success(res, data, log) {
  if (log) {
    logger.debug(data);
  }

  if (typeof data === 'string') {
    res.status(200).json({
      message: data
    });
  }

  res.status(200).json(data);
}

module.exports = (req, res, next) => {
  res.locals.error = error.bind(null, res); // eslint-disable-line
  res.locals.success = success.bind(null, res); // eslint-disable-line

  next();
};
