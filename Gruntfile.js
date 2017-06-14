module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	sass: {                              // Task
		dist: {                            // Target
			options: {                       // Target options
				style: 'expanded'
			},
			files: {                         // Dictionary of files
				'style.css': 'style.scss'
			}
		}
	}
});

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default task(s).
  grunt.registerTask('default', ['sass']);

};