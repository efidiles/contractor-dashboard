import {paths} from './webpack.config.base';
import webpackConfig from './webpack.config.dist.js';

webpackConfig.entry = {};

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],

    // list of files / patterns to load in the browser
    files: [
      './test/setup-tests.js',
      './test/**/*.spec.jsx'
    ],

    // list of files to exclude
    exclude: [],

    webpack: Object.assign({}, webpackConfig, {
      externals: {
        'react/lib/ReactContext': 'window'
      }
    }),

    // preprocess matching files before serving them to the browser
    // available preprocessors:
    // https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './test/**/*.spec.jsx': ['webpack']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters:
    // https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    client: {
      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
        ui: 'bdd',
        timeout: '2000'
      }
    },

    reportSlowerThan: 500,

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever
    // any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers:
    // https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      //'Chrome'
      //'PhantomJS'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

  	webpackMiddleware: {
      //quiet: true,
  		noInfo: true
  	}
  });
};
