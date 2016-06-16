const DefinePlugin = require('webpack').DefinePlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin;
const path = require('path');

module.exports = {
  context: __dirname,
  entry: {
    'site-main': './src/index.js',
    'site-examples': './src/examples/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
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
      {
        test: /\.(svg|png)$/,
        loader: 'file-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'react-taco-table/style': path.join(__dirname, '../src/style'),
      'react-taco-table': path.join(__dirname, '../src/index'),
    },
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new ExtractTextPlugin('main.css'),
    new HtmlPlugin({
      chunks: ['site-main'],
      template: './src/index.html',
      filename: 'index.html',
    }),
    new HtmlPlugin({
      chunks: ['site-examples'],
      template: './src/examples/index.html',
      filename: 'examples.html',
    }),
    new UglifyJsPlugin(),
  ],
};
