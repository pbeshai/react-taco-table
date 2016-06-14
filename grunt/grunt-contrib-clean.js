module.exports = function gruntCleanInit(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.config.set('clean', {
    build: ['dist'],
  });
};
