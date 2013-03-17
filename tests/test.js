var assert = require('assert')
, snowdrop = require('../snowdrop')
, fs = require('fs')
, sys   = require('sys')
, exec  = require('child_process').exec
;

var testDirBase = '/tmp/snowdrop-test';
var testDir = testDirBase + '/foo/bar/baz';
var badDir = testDirBase + '/bad/foo/bar/baz';

describe('Snowdrop', function() {
  before(function(done) {
    exec('rm -rf ' + testDirBase, function(err, stdout, stderr) {
      if (err) throw err;
      exec('mkdir -p ' + testDir, function(err, stdout, stderr) {
        if (err) throw err;
        exec('mkdir -p ' + badDir, function(err, stdout, stderr) {
          if (err) throw err;
          exec('touch ' + testDir + '/.snowdrop.json', done);
        });
      });
    });
  });

  describe('#getPaths', function() {
    it('should be the right size', function() {
      assert.equal(snowdrop.getPaths(testDir).length, 6);
    });
    it('should contain the right elements', function() {
      var paths = snowdrop.getPaths(testDir);
      assert.equal(paths.indexOf('/tmp/snowdrop-test/foo/bar/baz/.snowdrop.json') > -1, true);
      assert.equal(paths.indexOf('/tmp/snowdrop-test/foo/bar/.snowdrop.json') > -1, true);
      assert.equal(paths.indexOf('/tmp/snowdrop-test/foo/.snowdrop.json') > -1, true);
      assert.equal(paths.indexOf('/tmp/snowdrop-test/.snowdrop.json') > -1, true);
      assert.equal(paths.indexOf('/tmp/.snowdrop.json') > -1, true);
      assert.equal(paths.indexOf('//.snowdrop.json') > -1, true);
    });
    it('should return paths in the correct order', function() {
      var paths = snowdrop.getPaths(testDir);
      assert.equal(paths.indexOf('/tmp/snowdrop-test/foo/bar/baz/.snowdrop.json') == 0, true);
      assert.equal(paths.indexOf('/tmp/snowdrop-test/foo/bar/.snowdrop.json') == 1, true);
      assert.equal(paths.indexOf('/tmp/snowdrop-test/foo/.snowdrop.json') == 2, true);
      assert.equal(paths.indexOf('/tmp/snowdrop-test/.snowdrop.json') == 3, true);
      assert.equal(paths.indexOf('/tmp/.snowdrop.json') == 4, true);
      assert.equal(paths.indexOf('//.snowdrop.json') == 5, true);
    });
  });

  describe('#configInPath', function() {
    it('should find it in ' + testDir, function() {
      snowdrop.configInPath(snowdrop.getPaths(testDir), function(success, file) {
        assert.equal(true, success);
        assert.equal(file, '/tmp/snowdrop-test/foo/bar/baz/.snowdrop.json');
      });
    });
    it('should not find it in ' + badDir, function() {
      snowdrop.configInPath(snowdrop.getPaths(badDir), function(success, file) {
        assert.equal(false, success);
      });
    });
  });

  after(function(done) {
    exec('rm -rf ' + testDirBase, function(err, stdout, stderr) {
      if (err) throw err;
      done();
    });
  });
});
