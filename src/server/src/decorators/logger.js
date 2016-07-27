/**
 * This package decorates a log4js logger instance.
 * For example it decorates the debug function by adding prefixes to all debug messages.
 * The prefix is specified in the exports function.
 */

const log4js = require('log4js');
const fs = require('fs');

let log4jsInstance; // eslint-disable-line

const getLoggerInstance = () => {
  const instance = log4js.getLogger();
  const logLevel = process.env.LOG_LEVEL || 'warn';
  const configFile = process.env.LOG_CONFIG_FILE || 'logger.conf.json';

  instance.debug('From logger: Setting log level to', logLevel);
  instance.setLevel(logLevel);

  instance.trace('From logger: configFile', configFile);

  instance.debug('From logger: Trying to load local config file');
  try {
    fs.accessSync(configFile, fs.F_OK);
    log4js.configure(configFile, { reloadSecs: 300 });
  } catch (e) {
    instance.debug('From logger: No local config file');
  }

  return instance;
};

const invokeWithPrefix = (method, modulePrefix, ...rest) => {
  let params = rest;

  if (modulePrefix) {
    params = [`${modulePrefix}:`, ...rest];
  }

  log4jsInstance[method](...params);
};

const createDecorator = modulePrefix => ({
  trace: invokeWithPrefix.bind(null, 'trace', modulePrefix),
  debug: invokeWithPrefix.bind(null, 'debug', modulePrefix),
  info: invokeWithPrefix.bind(null, 'info', modulePrefix),
  warn: invokeWithPrefix.bind(null, 'warn', modulePrefix),
  error: invokeWithPrefix.bind(null, 'error', modulePrefix),
  fatal: invokeWithPrefix.bind(null, 'fatal', modulePrefix)
});

log4jsInstance = getLoggerInstance();

module.exports = createDecorator;
