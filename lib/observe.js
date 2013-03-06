var clc = require('cli-color')
, watch = require('watch')
, fs    = require('fs')
, path  = require('path')
, Rsync = require('rsync')
, sys   = require('sys')
, exec  = require('child_process').exec
;

var options = null;
var rsync = new Rsync();
var todoOnChange = [];

module.exports = {
  observe: function(markerFileName, configFile) {
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

    process.chdir(path.dirname(configFile));
    options = require(configFile);

    if(options.destination != false) {
      rsync.source(options.source);
      rsync.destination(path.dirname(options.destination));
      rsync.flags(options.rsync.flags.join(''));
      for(var i in options.rsync.options) {
        rsync.set(i, options.rsync.options[i]);
      }
      todoOnChange.push(doRsync);
    }

    if(options.ctags) {
      todoOnChange.push(doCtags);
    }

    doTodos();
    doInits();

    watch(process.cwd() + path.sep);
    walk(process.cwd(), function(err, results){
    });
  }
}


var doInits = function() {
  for(var i in options.init) {
    console.log(clc.yellow("[init]: ") + options.init[i]);
    exec(options.init[i], function(err, stdout, stderr){
      if(err) {
        console.log(err, stderr);
      }
    });
  }
}

var doTodos = function() {
  for(var i in todoOnChange) {
    todoOnChange[i]();
  }
}

var doRsync = function() {
  rsync.execute(function(err, stdout, stderr){
    if(err) {
      console.log(err, stderr);
    }
  });
}

var doCtags = function() {
  exec("ctags -R -f ./tags", function(err, stdout, stderr){
    console.log(stdout);
  });
}

var matchesIgnores = function(string) {
  for(var i in options.ignore) {
    var test = new RegExp(options.ignore[i]);
    if(string.match(test) !== null) {
      return true;
    }
  }
  return false;
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
          if(!matchesIgnores(file)) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

var watch = function(dir) {
  if(!matchesIgnores(dir)) {
    fs.watch(dir, function(event, filename) {
      if(dir.match(/\/$/) == null) {
        dir += path.sep;
      }
      doTodos();
      console.log(clc.yellow(' ==> ') + clc.blue(dir + filename));
    });
  }
}