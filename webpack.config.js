const DefinePlugin = require('webpack').DefinePlugin;
const UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin;

module.exports = {
  context: __dirname,
  entry: {
    'react-taco-table': './src/index.js',
  },
  output: {
    path: 'dist',
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new UglifyJsPlugin(),
  ],
};
