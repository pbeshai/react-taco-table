const webpackConfig = require('../webpack.config');
const webpackSiteConfig = require('../site/webpack.config');
const webpackSiteBuildConfig = require('../site/webpack.config.build');

module.exports = function gruntWebpackInit(grunt) {
  grunt.loadNpmTasks('grunt-webpack');

  grunt.config.set('webpack', {
    // for building prod files
    build: webpackConfig,

    // for dev for the site
    site: webpackSiteConfig,

    // for building prod files for the site
    'site-build': webpackSiteBuildConfig,
  });

  grunt.config.set('webpack-dev-server', {
    dev: {
      host: '0.0.0.0',
      port: grunt.option('port') || 8080,
      hot: true,
      inline: true,
      keepalive: true,
      webpack: webpackSiteConfig,
    },
  });
};
