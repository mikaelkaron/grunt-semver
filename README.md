[![Build Status](https://travis-ci.org/mikaelkaron/grunt-semver.png)](https://travis-ci.org/mikaelkaron/grunt-semver)
[![NPM version](https://badge.fury.io/js/grunt-semver.png)](http://badge.fury.io/js/grunt-semver)

# grunt-semver

> Semantic versioner for grunt

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-semver --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-semver');
```

## The "grunt-semver" task

### Overview
In your project's Gruntfile, add a section named `semver` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  "semver": {
    "options": {
      // Task-specific options go here.
    },
    "your_target": {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.space
Type: `String`  
Default value: `\t`

A string value that is used to format the output JSON

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.1.1 - Added support for templated arguments  
0.1.0 - First somewhat stable release  
0.0.3 - Nothing to important  
0.0.2 - Added support for `build`  
0.0.1 - First release
