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

	/**
	 * Formats a semver version
	 * @param {SemVer} version
	 * @returns {String} Formatted semver
	 */
	function format(version) {
		// Call super
		var result = version.format();

		// Get build
		var build = version.build;

		// Add build if it exists
		if (build && build.length) {
			result += "+" + build.join(".");
		}

		return result;
	}

	/**
	 * Processes parameter
	 * @param {*} param Paramter
	 * @returns {*} Processed parameter
	 */
	function process(param) {
		return grunt.util.kindOf(param) === "string"
			? grunt.template.process(param, {
				"delimiters" : SEMVER
			})
			: param;
	}

	// Add SEMVER delimiters
	grunt.template.addDelimiters(SEMVER, "{%", "%}");

	// Register SEMVER task
	grunt.task.registerMultiTask(SEMVER, "Semantic versioner for grunt", function (phase, part, build) {
		// Get options (with defaults)
		var options = this.options(OPTIONS);

		// Process arguments
		phase = process(phase);
		part = process(part);
		build = process(build);

		// Log flags (if verbose)
		grunt.log.verbose.writeflags(options);

		// Pick phase
		switch (phase) {
			case "validate" :
				grunt.log.verbose.writeflags({
					"phase": phase,
					"version": part,
					"build": build
				});

				if (part) {
					try {
						grunt.log.writeln(format(semver(build ? semver.clean(part) + "+" + build : part)).green);
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

							grunt.log.verbose.writeln(src + " version : " + json[VERSION].cyan);

							grunt.log.writeln(src + " : " + format(semver(build ? semver.clean(json[VERSION]) + "+" + build : json[VERSION])).green);
						}
						catch (e) {
							grunt.fail.warn(e);
						}
					});
				}
				break;

			case "set" :
				grunt.log.verbose.writeflags({
					"phase": phase,
					"version": part,
					"build": build
				});

				this.files.forEach(function (file) {
					try {
						var src = file.src;
						var json = grunt.file.readJSON(src);

						grunt.log.verbose.write(src + " version : " + json[VERSION].cyan);
						if (part) {
							grunt.log.verbose.write(" (but will use " + part.cyan + " instead)");
						}
						grunt.log.verbose.writeln();

						grunt.log.write(src + " : ");
						var version = json[VERSION] = format(semver(build ? semver.clean(part || json[VERSION]) + "+" + build : part || json[VERSION]));
						grunt.log.writeln(version.green);

						grunt.file.write(file.dest, JSON.stringify(json, null, options[SPACE]));
					}
					catch (e) {
						grunt.fail.warn(e);
					}
				});
				break;

			case "bump" :
				grunt.log.verbose.writeflags({
					"phase": phase,
					"part": part,
					"build": build
				});

				switch (part) {
					case "major" :
					case "minor" :
					case "patch" :
					case "prerelease" :
						this.files.forEach(function (file) {
							try {
								var src = file.src;
								var json = grunt.file.readJSON(src);

								grunt.log.verbose.writeln(src + " version : " + json[VERSION].cyan);

								grunt.log.write(src + " : ");
								var version = json[VERSION] = format(semver(build ? semver.clean(json[VERSION]) + "+" + build : semver.clean(json[VERSION])).inc(part));
								grunt.log.writeln(version.green);

								grunt.file.write(file.dest, JSON.stringify(json, null, options[SPACE]));
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
