require('dotenv').config();

const webpack = require('webpack');

const webpackConfig = require('./webpack.base');

const devServerPort = process.env.APP_PORT;
const paths = webpackConfig.paths;

webpackConfig.entry = webpackConfig.entry.concat([
  // this modules required to make HRM working
  // it responsible for all this webpack magic
  'webpack-hot-middleware/client?reload=true'
]);

webpackConfig.output = {
  path: paths.dev,
  filename: '[name].bundle.js',
  sourceMapFilename: '[file].map',
  publicPath: '/'
};

webpackConfig.plugins = [
  ...webpackConfig.plugins,
  // Adds webpack HMR support. It act's like livereload,
  // reloading page after webpack rebuilt modules.
  // It also updates stylesheets and inline assets without page reloading.
  new webpack.HotModuleReplacementPlugin()
];

webpackConfig.devServer = {
  inline: true,
  port: devServerPort,
  hot: true
};

module.exports = webpackConfig;
