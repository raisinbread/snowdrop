var clc = require('cli-color')
, watch = require('watch')
, fs    = require('fs')
, path  = require('path')
;

var ignore = [/\.git/];

module.exports = {
  observe: function() {
    console.log();
    console.log(clc.white('      |\\__/,|   (`\\'));
    console.log(clc.white('    _ |') + clc.green('. .') + clc.white('  |_  _) )'));
    console.log(
      clc.blue('---') +
      clc.white('(((') +
      clc.blue('---') +
      clc.white('(((') +
      clc.blue('-----------------------------------------------')
    );
    console.log();

    watch(process.cwd() + path.sep);
    walk(process.cwd(), function(err, results){
    });
  }
}

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          watch(file);
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          // File listing
          if(file.match(/\.git/) == null) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

var watch = function(dir) {
  if(dir.match(/\.git/) == null) {
    fs.watch(dir, function(event, filename) {
      if(dir.match(/\/$/) == null) {
        dir += path.sep;
      }
      console.log(event, dir + filename);
    });
  }
}
