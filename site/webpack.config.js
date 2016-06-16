const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: './src',
  devtool: 'eval-cheap-module-source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(css|scss)$/,
        loader: 'style-loader!css-loader!sass-loader',
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
    new HtmlPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
};
