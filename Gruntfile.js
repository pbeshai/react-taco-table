module.exports = function gruntInit(grunt) {
  grunt.loadTasks('grunt');

  grunt.registerTask('build-env', function setBuildEnv() {
    process.env.NODE_ENV = 'production';
  });

  grunt.registerTask('build', ['build-env', 'webpack:build']);
  grunt.registerTask('default', ['clean', 'build']);
};
