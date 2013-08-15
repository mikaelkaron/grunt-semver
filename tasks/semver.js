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

	var SPACE = "space";
	var VERSION = "version";
	var OPTIONS = {};

	OPTIONS[SPACE] = "\t";

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

	grunt.task.registerMultiTask("semver", "Semantic versioner for grunt", function (phase, part, build) {
		var options = this.options(OPTIONS);

		// Log flags (if verbose)
		grunt.log.verbose.writeflags(options);

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

							grunt.log.writeln(src + " : " + format.call(semver(build ?semver.clean(json[VERSION]) + "+" + build : json[VERSION])).green);
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
