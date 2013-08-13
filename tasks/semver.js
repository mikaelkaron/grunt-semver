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

		var prerelease = me.prerelease;
		var build = me.build;
		var result = [ me.major, me.minor, me.patch ].join(".");

		if (prerelease && prerelease.length) {
			result += '-' + prerelease.join(".");
		}

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
						grunt.log.ok(format.call(build ? semver(semver(part) + "+" + build) : semver(part)));
					}
					catch (e) {
						grunt.fail.warn(e);
					}
				}
				else {
					this.files.forEach(function (file) {
						var src = file.src;
						var json = grunt.file.readJSON(src);

						try {
							grunt.log.ok(src + " : " + format.call(build ? semver(semver(json[VERSION]) + "+" + build) : semver(json[VERSION])));
						}
						catch (e) {
							grunt.fail.warn(e);
						}
					});
				}
				break;

			case "set" :
				this.files.forEach(function (file) {
					var src = file.src;
					var dest = file.dest || src;
					var json = grunt.file.readJSON(src);
					var version;

					try {
						version = json[VERSION] = format.call(build ? semver(semver(part || json[VERSION]) + "+" + build) : semver(part || json[VERSION]));

						grunt.log.ok(src + " : " + version);

						grunt.file.write(dest, JSON.stringify(json, null, options[SPACE]));
					}
					catch (e) {
						grunt.fail.warn(e);
					}
				});
				break;

			case "bump" :
				this.files.forEach(function (file) {
					var src = file.src;
					var dest = file.dest || src;
					var json = grunt.file.readJSON(src);
					var version;

					switch (part) {
						case "major" :
						case "minor" :
						case "patch" :
						case "prerelease" :
							try {
								version = json[VERSION] = format.call((build ? semver(semver(json[VERSION]) + "+" + build) : semver(json[VERSION])).inc(part));

								grunt.log.ok(src + " : " + version);

								grunt.file.write(dest, JSON.stringify(json, null, options[SPACE]));
							}
							catch (e) {
								grunt.log.error(e);
							}

							break;

						default :
							grunt.fail.warn("Unknown part '" + part + "'");
					}
				});
				break;

			default :
				grunt.fail.warn("Unknown phase '" + phase + "'");
		}
	});
};
