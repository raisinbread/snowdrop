var async  = require('async')
, readline = require('readline')
, path     = require('path')
, fs       = require('fs')
, clc      = require('cli-color')
;

var rl = readline.createInterface({
  input  : process.stdin,
  output : process.stdout
});

var config = defaults = {
  source: process.cwd(),
  destination: '',
  ignore: ["\\.git"],
  init: [],
  rsync: {
    "flags": ['a','u','v','z','x','i'],
    "options": {}
  }
};

module.exports = {
  create: function(markerFileName) {
    async.series({
      destination: function(callback) {
        rl.question("Use rsync? ", function(answer) {
          if(answer.match('^[Yy]') != null) {
            rl.question("Destination: ", function(answer) {
              callback(null, answer);
            });
          } else {
            callback(null, false);
          }
        });
      },
      ctags: function(callback) {
        rl.question("Use ctags? ", function(answer) {
          if(answer.match('^[Yy]') != null) {
            callback(null, true);
          } else {
            callback(null, false);
          }
        });
      },
      init: function(callback) {
        rl.question("Anything you want to run on start? ", function(answer){
          if(answer.match('^[Yy]') != null) {
            var initCommands = [];
            var another = true;
            async.whilst(
              function() {return another},
              function(callback) {
                rl.question("Command: ", function(answer){
                  initCommands.push(answer);
                  rl.question("Another? ", function(answer){
                    if(answer.match('^[Yy]') != null) {
                      another = true;
                    } else {
                      another = false;
                    }
                    callback();
                  });
                });
              },
              function() {
                callback(null, initCommands);
              }
            );
          } else {
            callback(null, false);
          }
        });
      }
    },
    function(err, results){
      rl.close();
      for(key in results) {
        config[key] = results[key];
      }
      fs.writeFileSync(
        process.cwd() + path.sep + markerFileName,
        JSON.stringify(config, null, 4)
      );
      console.log(clc.green('Done.'));
    });
  }
}
