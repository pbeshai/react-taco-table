const DefinePlugin = require('webpack').DefinePlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin;
const path = require('path');

console.log("TEST DIRNAME", __dirname);
module.exports = {
  context: __dirname,
  entry: './src',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
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
      template: './src/index.html',
      filename: 'index.html',
    }),
    new UglifyJsPlugin(),
  ],
};
