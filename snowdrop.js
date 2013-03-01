#!/usr/bin/env node

var path   = require('path')
, fs       = require('fs')
, clc      = require('cli-color')
, async    = require('async')
;

var markerFileName = '.snowdrop.json'
var configFile     = null;

var cwd = process.cwd();
var configFilePaths = [cwd + path.sep + markerFileName];
while(cwd != path.sep) {
  configFilePaths.push(path.dirname(cwd) + path.sep + markerFileName);
  cwd = path.dirname(cwd);
}

async.filter(configFilePaths, fs.exists, function(results){
  if(results.length > 0) {
    configFile = results.pop();
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

