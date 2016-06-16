const DefinePlugin = require('webpack').DefinePlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
      {
        test: /\.(css|scss)$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  // this has been moved here from .babelrc so that our test environment
  // can run. react-hmre was breaking the loader otherwise. There rest
  // of the config stays in .babelrc.
  babel: {
    env: {
      presets: ['react-hmre'],
    },
  },

  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new ExtractTextPlugin('react-taco-table.css'),
    new UglifyJsPlugin(),
  ],
};
