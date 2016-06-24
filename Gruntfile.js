module.exports = function gruntInit(grunt) {
  grunt.loadTasks('grunt');

  grunt.registerTask('build-env', function setBuildEnv() {
    process.env.NODE_ENV = 'production';
  });

  // for building the JS files
  grunt.registerTask('build', ['clean:build', 'build-env', 'webpack:build', 'sass', 'babel']);

  // for building the site
  grunt.registerTask('site', ['webpack-dev-server']);
  grunt.registerTask('site-build', ['clean:site-build', 'build-env', 'webpack:site-build', 'copy:docs']);

  // default is to build the js files and the site
  grunt.registerTask('default', ['build', 'site-build']);
};
