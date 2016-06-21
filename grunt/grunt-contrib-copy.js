module.exports = function gruntCopyInit(grunt) {
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.config.set('copy', {
    docs: {
      expand: true,
      src: 'docs/**/*',
      dest: 'site/dist/',
    },
  });
};
