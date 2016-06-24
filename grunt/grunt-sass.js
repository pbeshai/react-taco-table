module.exports = function gruntSassInit(grunt) {
  grunt.loadNpmTasks('grunt-sass');

  grunt.config.set('sass', {
    build: {
      files: {
        'dist/react-taco-table.css': 'src/style/taco-table.scss',
      },
    },
  });
};
