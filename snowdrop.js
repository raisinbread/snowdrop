#!/usr/bin/env node

var path   = require('path')
, fs       = require('fs')
, clc      = require('cli-color')
, async    = require('async')
;

var markerFileName = '.snowdrop.json'
var configFile     = null;

module.exports = {
  'getPaths':function(dir) {
    var cwd = process.cwd();
    if(typeof(dir) != 'undefined' && fs.existsSync(dir)) {
      cwd = dir;
    }
    var configFilePaths = [cwd + path.sep + markerFileName];
    while(cwd != path.sep) {
      configFilePaths.push(path.dirname(cwd) + path.sep + markerFileName);
      cwd = path.dirname(cwd);
    }
    return configFilePaths;
  },
  'configInPath':function(configFilePaths, callback) {
    async.filter(configFilePaths, fs.exists, function(results){
      if(results.length > 0) {
        callback(true, results.pop());
      } else {
        callback(false);
      }
    });
  }
}

// Don'r run if we're running the test suite.
if(process.argv[1].match(/mocha/) == null) {
  module.exports.configInPath(module.exports.getPaths(), function(result, configFile){
    if(result) {
      if(process.argv.length > 2 && process.argv[2] == '-u') {
        require('./lib/update').update(configFile);
      } else {
        require('./lib/observe').observe(markerFileName, configFile);
      }
    } else {
      console.log(clc.red('No config file exists.'));
      console.log(clc.yellow("Initializing config at " + process.cwd() + path.sep + markerFileName));
      require('./lib/create').create(markerFileName);
    }
  });
}
