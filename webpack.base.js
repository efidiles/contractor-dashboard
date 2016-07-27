const path = require('path');
const webpack = require('webpack');
const findup = require('findup-sync');
const HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const cssOptions = [
  'sourceMap',
  'modules',
  'localIdentName=[name]-[local]_[hash:base64:5]'
].join('&');
const sassOptions = [
  'sourceMap',
  'outputStyle=expanded'
].join('&');

const packageJson = findup('package.json');
const root = path.dirname(packageJson);
const dist = path.join(root, 'dist');
const dev = path.join(root, 'dev');
const src = path.join(root, 'src');
const index = path.join(src, 'client/app/main.jsx');
const appEntry = path.join(src, 'client/index.ejs');

const paths = {
  root,
  dist,
  dev,
  src,
  index,
  appEntry,
  packageJson
};

const webpackConfig = {
  devtool: 'source-map',
  entry: [paths.index],
  target: 'web',
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    preLoaders: [{
      test: /\.jsx?$/,
      include: src,
      exclude: /bundle\.js$/,
      loader: 'eslint-loader'
    }],
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.html$/,
      loader: 'raw'
    }, {
      test: /\.(jpe?g|png|eot|woff2|ttf|gif|svg|ico)(\?.*)?$/i,
      loader: 'url-loader'
    }, {
      test: /\.s?css$/,
      loader: `style!css?${cssOptions}!sass?${sassOptions}`
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${process.env.NODE_ENV || 'development'}'`,
        MOCK_API: `'${!!process.env.MOCK_API}'`,
        LOG_MODULE: `'${process.env.LOG_MODULE || ''}'`
      }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    // 	name: 'vendor',
    // 	minChunks: function(module) {
    // 		// Don't include things under '/src' folder
    // 		return module.resource && module.resource.indexOf(src) === -1;
    // 	}
    // }),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: paths.appEntry
    })
  ]
};

module.exports = webpackConfig;
module.exports.paths = paths;
