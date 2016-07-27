const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const os = require('os');
const jsonfile = require('jsonfile');
const promisify = require('es6-promisify');
const mkdirp = require('mkdirp');
const EventEmitter = require('events').EventEmitter;

const logger = require('../decorators/logger')('From localData');

logger.debug('Inside localData module');

const userDirPath = path.join(os.homedir(), '.config');
const userConfigPath = path.join(userDirPath, 'contractor-dashboard.json');

logger.trace('userDirPath', userDirPath);
logger.trace('userConfigPath', userConfigPath);

const defaults = {
  USER: {
    FIRST_NAME: undefined,
    LAST_NAME: undefined,
    COMPANY_NAME: undefined
  },
  ACCESS_SCOPES: [],
  AGENT_EMAIL: {
    FROM: undefined,
    RECEIPIENTS: undefined,
    SUBJECT_TEMPLATE: 'Timesheet - ${ name } (${ company }) - period ending ${ period }',
    BODY_TEMPLATE: 'Hi,\n\nPlease find attached the timesheet ${ invoice } for ' +
      'period ending ${ period }.\n\nRegards,\n${ name }'
  },
  CREDENTIALS: {
    ID: undefined,
    SECRET: undefined,
    REDIRECT_URL: 'http://localhost:8066/auth/callback'
  },
  TOKEN: {},
  URLS: {
    APP_ROOT: process.env.APP_URL
  }
};

logger.trace('defaults:', defaults);

const emitter = new EventEmitter();
let publicApi = undefined;
let localConfig = undefined;

function load() {
  logger.debug('Inside load');

  mkdirp.sync(userDirPath);
  logger.debug('Created', userDirPath);

  try {
    logger.debug('Trying to read', userConfigPath);

    fs.accessSync(userConfigPath, fs.F_OK);
    const fileData = jsonfile.readFileSync(userConfigPath);

    logger.trace('fileData', fileData);
    logger.debug('Config file found.');

    _.merge(localConfig, fileData);

    logger.trace('localConfig:', localConfig);
  } catch (e) {
    logger.debug('No local config file found');
  }
}

/**
 * Gets only the config properties.
 * @method _getPlainConfig
 * @return {Object}
 */
function _getPlainConfig() {
  logger.debug('Inside _getPlainConfig');

  return _.reduce(localConfig, (result, value, key) => {
    if (_.has(publicApi, key)) {
      return result;
    }

    const plainConfig = result;

    plainConfig[key] = value;

    return plainConfig;
  }, {});
}

function save() {
  logger.debug('Inside save');

  function _triggerEvent(result) {
    logger.debug('Trigerring saved event');

    emitter.emit('saved');
    return result;
  }

  const config = _getPlainConfig();
  const writeFile = promisify(jsonfile.writeFile);

  logger.debug('Trying to write local config file');
  logger.trace('config', config);

  return writeFile(userConfigPath, config, {
    spaces: 2
  })
  .then(_triggerEvent)
  .catch(error => {
    logger.error('Failed writing config data to local file', error);

    logger.debug('Trigerring saved failed event');
    emitter.emit('save:failed');
  });
}

publicApi = {
  load,
  save,
  on: emitter.on.bind(emitter)
};

localConfig = _.merge({}, defaults, publicApi);

logger.trace('localConfig:', localConfig);

module.exports = localConfig;
