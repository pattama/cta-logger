'use strict';

const assert = require('chai').assert;
const loggerLib = require('../lib');
const path = require('path');
const fs = require('fs');
const util = require('util');
const logFile = __dirname + path.sep + 'test.log';

describe('tests', function() {
  before(function(done) {
    try {
      fs.unlink(logFile, function() {
        done();
      });
    } catch (e) {
      done();
    }
  });
  it('log as different authors', function(done) {
    try {
      const loggers = {
        one: loggerLib({
          author: 'one',
          level: 'debug',
          filename: logFile,
        }),
        two: loggerLib({
          author: 'two',
          level: 'debug',
          filename: logFile,
        }),
      };
      const msg = {
        one: [
          'message from author one',
          'another message from author one with meta',
          {author: 'one', meta: 'data'},
        ],
        two: [
          'author two message',
          'another two again but with meta data',
          {author: 'two', meta: 'data'},
        ],
      };
      loggers.one.info(msg.one[0]);
      loggers.one.info(msg.one[1], msg.one[2]);

      loggers.two.info(msg.two[0]);
      loggers.two.info(msg.two[1], msg.two[2]);

      setTimeout(function() {
        fs.readFile(logFile, 'utf8', (err, data) => {
          if (err) {
            done(err);
          }
          assert(data.indexOf(msg.one[0]) !== -1);
          assert(data.indexOf(msg.one[1]) !== -1);
          assert(data.indexOf(util.inspect(msg.one[2], false, 5, false)) !== -1);

          assert(data.indexOf(msg.two[0]) !== -1);
          assert(data.indexOf(msg.two[1]) !== -1);
          assert(data.indexOf(util.inspect(msg.two[2], false, 5, false)) !== -1);
          done();
        });
      }, 500);
    } catch (e) {
      done(e);
    }
  });
});
