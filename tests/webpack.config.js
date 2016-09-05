module.exports = {
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
      },
      {
        test: /\.(css|scss)$/,
        loader: 'null-loader',
      },
    ],
  },
  // for Enzyme
  externals: {
    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
};
