var clc        = require('cli-color')
, Rsync        = require('rsync')
, sys          = require('sys')
, exec         = require('child_process').exec
, path         = require('path')
, interval     = require('clock/lib/interval')
, ansiThrobber = require('cli-color/lib/throbber')
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

    console.log(clc.yellow('Updating...'));
    var i = interval(200, true);
    ansiThrobber(i);
    exec(rsync.command(), function(err, stdout, stderr) {
      i.stop();
      console.log(clc.green('Done.'));
    });
  }
}
