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
	var _ = grunt.util._;
	var _process = require("grunt-util-process")(grunt);
	var _options = require("grunt-util-options")(grunt);
	var _args = require("grunt-util-args")(grunt);
	var SPACE = "space";
	var PART = "part";
	var BUILD = "build";
	var VERSION = "version";
	var SEMVER = "semver";
	var SEMVER_VALIDATE = SEMVER + ".validate";
	var SEMVER_SET = SEMVER + ".set";
	var SEMVER_BUMP = SEMVER + ".bump";

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

	// Add SEMVER delimiters
	grunt.template.addDelimiters(SEMVER, "{%", "%}");

	// Register SEMVER task
	grunt.task.registerMultiTask(SEMVER, "Semantic versioner for grunt", function (phase, part, build) {
		var me = this;

		// Get options and process
		var options = _process.call(_options.call(me, _.defaults(_args.call(me, null, PART, BUILD), me.options(OPTIONS)), PART, BUILD), {
			"delimiters" : SEMVER
		}, PART, BUILD);

		// Update parameters
		part = options[PART];
		build = options[BUILD];

		// Log flags (if verbose)
		grunt.log.verbose.writeflags(options);

		// Pick phase
		switch (phase) {
			case "validate" :
				if (part) {
					try {
						grunt.event.emit(SEMVER_VALIDATE, (function(version) {
							grunt.log.writeln(version.green);

							return version;
						}(format(semver(build ? semver.clean(part) + "+" + build : part)))));
					}
					catch (e) {
						grunt.fail.warn(e);
					}
				}
				else {
					this.files.forEach(function (file) {
						file.src.forEach(function (src) {
							try {
								var json = grunt.file.readJSON(src);

								grunt.log.verbose.writeln(src + " version : " + json[VERSION].cyan);

								var version = format(semver(build ? semver.clean(json[VERSION]) + "+" + build : json[VERSION]));

								grunt.log.writeln(src + " : " + version.green);

								grunt.event.emit(SEMVER_VALIDATE, version, src);
							}
							catch (e) {
								grunt.fail.warn(e);
							}
						});
					});
				}
				break;

			case "set" :
				this.files.forEach(function (file) {
					var dest = file.dest;

					file.src.forEach(function (src) {
						try {
							var json = grunt.file.readJSON(src);

							grunt.log.verbose.write(src + " version : " + json[VERSION].cyan);
							if (part) {
								grunt.log.verbose.write(" (but will use " + part.cyan + " instead)");
							}
							grunt.log.verbose.writeln();

							grunt.log.write(src + " : ");
							var version = json[VERSION] = format(semver(build ? semver.clean(part || json[VERSION]) + "+" + build : part || json[VERSION]));
							grunt.log.writeln(version.green);

							grunt.file.write(dest, JSON.stringify(json, null, options[SPACE]));

							grunt.event.emit(SEMVER_SET, version, src, dest);
						}
						catch (e) {
							grunt.fail.warn(e);
						}
					});
				});
				break;

			case "bump" :
				switch (part) {
					case "major" :
					case "minor" :
					case "patch" :
					case "prerelease" :
						this.files.forEach(function (file) {
							var dest = file.dest;

							file.src.forEach(function (src) {
								try {
									var json = grunt.file.readJSON(src);

									grunt.log.verbose.writeln(src + " version : " + json[VERSION].cyan);

									grunt.log.write(src + " : ");
									var version = json[VERSION] = format(semver(build ? semver.clean(json[VERSION]) + "+" + build : semver.clean(json[VERSION])).inc(part));
									grunt.log.writeln(version.green);

									grunt.file.write(dest, JSON.stringify(json, null, options[SPACE]));

									grunt.event.emit(SEMVER_BUMP, version, src, dest);
								}
								catch (e) {
									grunt.fail.warn(e);
								}
							});
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
