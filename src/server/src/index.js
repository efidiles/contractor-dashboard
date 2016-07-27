const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const os = require('os');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const localData = require('./utils/local-data');
const responseHelpers = require('./middlewares/response-helpers');
const requireScope = require('./middlewares/require-scope');
const requireEmailSettings = require('./middlewares/require-email-settings');
const requireToken = require('./middlewares/require-token');
const googleApi = require('./facades/google-api');
const routes = require('./routes');
const logger = require('./decorators/logger')('From index');

const userDirPath = path.join(os.homedir(), '.contractor-dashboard');
const uploadsDir = path.join(userDirPath, 'uploads');
const upload = multer({
  dest: uploadsDir
});

// Clear the downloads
rimraf.sync(uploadsDir);
mkdirp.sync(uploadsDir);

function setAccessHeaders(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200);
    return res.end();
  }

  return next();
}

function disableCaching(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');

  next();
}

function loadMiddlewares(app) {
  logger.debug('Inside loadMiddlewares');

  app.use(compression());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(responseHelpers);
  app.use(setAccessHeaders);
  app.use(disableCaching);
}

function setupRoutes(app) {
  logger.debug('Inside setupRoutes');

  function setupMainRouter() {
    const mainRouter = express.Router();

    app.use('/', mainRouter);

    mainRouter.get('/', routes.main.root);
    mainRouter.get('/test', routes.main.test);
  }

  function setupConfigRouter() {
    const configRouter = express.Router();

    app.use('/config', configRouter);

    configRouter.get('/app', routes.config.app.load);
    configRouter.put('/app', routes.config.app.save);
    configRouter.get('/agent-email', routes.config.agentEmail.load);
    configRouter.put('/agent-email', routes.config.agentEmail.save);
  }

  function setupAuthRouter() {
    const authRouter = express.Router();

    app.use(
      '/auth',
      requireEmailSettings,
      authRouter
    );

    authRouter.get('/callback', routes.auth.callback);
  }

  function setupAdminRouter() {
    const adminRouter = express.Router();

    adminRouter.get('/clear-token', routes.admin.clearToken);

    app.use(
      '/admin',
      requireEmailSettings,
      adminRouter
    );
  }

  function setupEmailRouter() {
    const emailRouter = express.Router();

    app.use(
      '/email',
      requireEmailSettings,
      requireScope(googleApi.SCOPE_TYPE.GMAIL),
      requireToken,
      emailRouter
    );

    emailRouter.post('/', upload.array('files', 5), routes.email.send);
  }

  setupMainRouter();
  setupConfigRouter();
  setupAuthRouter();
  setupAdminRouter();
  setupEmailRouter();
}

function appFactory() {
  logger.debug('Inside appFactory');

  const app = express();

  localData.load();
  loadMiddlewares(app);
  setupRoutes(app);

  logger.info(
    `Started API in ${process.env.NODE_ENV} environment on port ${process.env.API_PORT}`
  );

  return app;
}

module.exports = appFactory;
