const webpackConfig = require('../webpack.config');

module.exports = function gruntWebpackInit(grunt) {
  grunt.loadNpmTasks('grunt-webpack');

  grunt.config.set('webpack', {
    build: webpackConfig,
  });
};
