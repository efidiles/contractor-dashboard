require('dotenv').config();

const electron = require('electron'); // eslint-disable-line
const childProcess = require('child_process');
const path = require('path');

const ENVIRONMENTS = {
    PRODUCTION: 'production',
    DEVELOPMENT: 'development'
};

const nodeEnv = process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT;
const appPort = process.env.APP_PORT;
const apiPort = process.env.API_PORT;
const noApi = process.env.NO_API;

if (!nodeEnv) {
    throw new Error('Environment not set. Please configure the NODE_ENV variable');
}

if (!appPort) {
    throw new Error('App port not set. Please configure the APP_PORT variable');
}

if (!apiPort) {
    throw new Error('Api port not set. Please configure the API_PORT variable');
}

const electronApp = electron.app;
const BrowserWindow = electron.BrowserWindow;
const appIndexFile = path.resolve(__dirname, 'dist/index.html');
let bootstrapUrl = `http://localhost:${appPort}`;
let isLaunching = true;
let apiProcess;
// Keep a global reference of the window object to prevent garbage collection.
let mainWindow;

function showMainWindow() {
    if (isLaunching) {
        mainWindow.show();

        if (nodeEnv !== ENVIRONMENTS.PRODUCTION) {
            mainWindow.openDevTools();
        }

        isLaunching = false;
    }
}

function clearResources() {
    mainWindow = null;

    try {
        apiProcess.kill('SIGTERM');
    } catch (e) {
        // do nothing
    }
}

function checkIfMustQuit() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        electronApp.quit();
    }
}

function startApp() {
    mainWindow.loadURL(bootstrapUrl);

    mainWindow.maximize();

    mainWindow.once('maximize', showMainWindow);

    mainWindow.once('closed', clearResources);

    electronApp.once('window-all-closed', checkIfMustQuit);
}

function startApi() {
    const apiProcessOptions = {
        cwd: './src/server',
        env: {
            NODE_ENV: nodeEnv,
            API_PORT: apiPort,
            LOG_LEVEL: process.env.LOG_LEVEL,
            APP_URL: bootstrapUrl
        }
    };

    apiProcess = childProcess.fork('./bin/start', [], apiProcessOptions);

    apiProcess.once('message', data => {
        if (data === 'started') {
            startApp();
        }
    });
}

function onAppReady() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        show: false
    });

    mainWindow.webContents.on('will-navigate', function (event, url) {
        console.log('url', url);
    });

    mainWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
        if (newUrl.indexOf('file://') === 0) {
            mainWindow.loadURL(newUrl);
        }
    });

    if (nodeEnv !== ENVIRONMENTS.PRODUCTION) {
        startApp();
    }
}

electronApp.once('ready', onAppReady);

if (nodeEnv === ENVIRONMENTS.PRODUCTION) {
    bootstrapUrl = `file://${appIndexFile}`;

    if (!noApi) {
        startApi();
    }
}
