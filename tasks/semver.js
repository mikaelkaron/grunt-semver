/*
 * grunt-semver
 * https://github.com/mikaelkaron/grunt-semver
 *
 * Copyright (c) 2013 Mikael Karon
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
	"use strict";

	var semver = require("semver");
	var SEMVER = "semver";
	var SPACE = "space";
	var VERSION = "version";

	// Default options
	var OPTIONS = {};
	OPTIONS[SPACE] = "\t";

	// grunt.template.process options
	var PROCESS_OPTIONS = {
		"delimiters" : SEMVER
	};

	/**
	 * Formats a semver
	 * @returns {String} Formatted semver
	 */
	function format() {
		/*jshint validthis:true */
		var me = this;
		var build = me.build;

		// Call super
		var result = me.format();

		// Add build if it exists
		if (build && build.length) {
			result += "+" + build.join(".");
		}

		return result;
	}

	// Add SEMVER delimiters
	grunt.template.addDelimiters(SEMVER, "{%", "%}");

	// Register SEMVER task
	grunt.task.registerMultiTask(SEMVER, "Semantic versioner for grunt", function (phase, part, build) {
		// Get options (with defaults)
		var options = this.options(OPTIONS);

		// Log flags (if verbose)
		grunt.log.verbose.writeflags(options);

		// Process arguments
		if (grunt.util.kindOf(phase) === "string") {
			phase = grunt.template.process(phase, PROCESS_OPTIONS);
		}
		if (grunt.util.kindOf(part) === "string") {
			part = grunt.template.process(part, PROCESS_OPTIONS);
		}
		if (grunt.util.kindOf(build) === "string") {
			build = grunt.template.process(build, PROCESS_OPTIONS);
		}

		// Pick phase
		switch (phase) {
			case "validate" :
				if (part) {
					try {
						grunt.log.writeln(format.call(semver(build ? semver.clean(part) + "+" + build : part)).green);
					}
					catch (e) {
						grunt.fail.warn(e);
					}
				}
				else {
					this.files.forEach(function (file) {
						try {
							var src = file.src;
							var json = grunt.file.readJSON(src);

							grunt.log.writeln(src + " : " + format.call(semver(build ? semver.clean(json[VERSION]) + "+" + build : json[VERSION])).green);
						}
						catch (e) {
							grunt.fail.warn(e);
						}
					});
				}
				break;

			case "set" :
				this.files.forEach(function (file) {
					try {
						var src = file.src;
						var dest = file.dest || src;

						grunt.log.write(src + " : ");

						var json = grunt.file.readJSON(src);
						var version = json[VERSION] = format.call(semver(build ? semver.clean(part || json[VERSION]) + "+" + build : part || json[VERSION]).inc(part));

						grunt.log.writeln(version.green);

						grunt.file.write(dest, JSON.stringify(json, null, options[SPACE]));
					}
					catch (e) {
						grunt.fail.warn(e);
					}
				});
				break;

			case "bump" :
				switch (part) {
					case "major" :
					case "minor" :
					case "patch" :
					case "prerelease" :
						this.files.forEach(function (file) {
							try {
								var src = file.src;
								var dest = file.dest || src;

								grunt.log.write(src + " : ");

								var json = grunt.file.readJSON(src);
								var version = json[VERSION] = format.call(semver(build ? semver.clean(json[VERSION]) + "+" + build : semver.clean(json[VERSION])).inc(part));

								grunt.log.writeln(version.green);

								grunt.file.write(dest, JSON.stringify(json, null, options[SPACE]));
							}
							catch (e) {
								grunt.fail.warn(e);
							}
						});
						break;

					default :
						grunt.fail.warn("Unknown part '" + part + "'");
				}
				break;

			default :
				grunt.fail.warn("Unknown phase '" + phase + "'");
		}
	});
};
