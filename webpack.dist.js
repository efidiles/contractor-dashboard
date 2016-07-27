const webpack = require('webpack');
const webpackConfig = require('./webpack.base');

const paths = webpackConfig.paths;

webpackConfig.output = {
  path: paths.dist,
  filename: '[name].bundle.js',
  publicPath: './'
};

webpackConfig.eslint = {
  failOnError: true
};

webpackConfig.module.loaders = webpackConfig.module.loaders.concat([{
  test: /\.jsx?$/,
  loader: 'webpack-strip?' +
    'strip[]=logger.debug,' +
    'strip[]=logger.trace,' +
    'strip[]=logger.error,' +
    'strip[]=logger.info,' +
    'strip[]=logger.warn,' +
    'strip[]=logger.only,' +
    'strip[]=const%20logger%20=%20loggerFactory,' +
    'strip[]=let%20logger%20=%20loggerFactory,' +
    'strip[]=var%20logger%20=%20loggerFactory'
}]);

// webpackConfig.plugins = webpackConfig.plugins.concat([
//   // Reduces bundles total size
//   new webpack.optimize.UglifyJsPlugin({
//     sourceMap: false,
//     mangle: false,
//     compress: {
//       warnings: false
//     }
//   })
// ]);

module.exports = webpackConfig;
