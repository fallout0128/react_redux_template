const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  watch: true,
  devServer: {
    historyApiFallback: true,
    contentBase: './public/',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
});