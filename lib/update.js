var clc = require('cli-color')
, Rsync = require('rsync')
, sys   = require('sys')
, exec  = require('child_process').exec
, path  = require('path')
;

var options = null;
var rsync = new Rsync();

module.exports = {
  update: function(configFile) {
    options = require(configFile);

    rsync.source(options.destination);
    rsync.destination(options.source);
    rsync.flags(options.rsync.flags.join(''));
    for(var i in options.rsync.options) {
      rsync.set(i, options.rsync.options[i]);
    }

    console.log(rsync.command());
    exec(rsync.command(), function(err, stdout, stderr) {
      console.log(clc.green('Done.'));
    });
  }
}
