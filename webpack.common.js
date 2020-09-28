const webpack = require('webpack')

module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'dist/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      { 
        test: /\.css$/, loader: "style-loader!css-loader" 
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: { 
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'DB_DIGITAL': JSON.stringify(process.env.DB_DIGITAL || 'off')
      }
    })
  ]
};