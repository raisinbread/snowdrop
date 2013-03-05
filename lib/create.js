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
        rl.question("Destination: ", function(answer) {
          callback(null, answer);
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
