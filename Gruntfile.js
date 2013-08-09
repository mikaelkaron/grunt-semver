/*
 * grunt-semver
 * https://github.com/mikaelkaron/grunt-semver
 *
 * Copyright (c) 2013 Mikael Karon
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		"jshint": {
			"all": [
				"Gruntfile.js",
				"tasks/*.js"
			],
			"options": {
				"jshintrc": ".jshintrc"
			}
		}
	});

	grunt.loadTasks("tasks");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.registerTask("default", [ "jshint" ]);
};
