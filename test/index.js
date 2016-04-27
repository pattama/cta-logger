'use strict';

const assert = require('chai').assert;
const loggerLib = require('../lib');
const path = require('path');
const fs = require('fs');
const logFile = __dirname + path.sep + 'json.log';

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

  it('log as json', function(done) {
    const logger = loggerLib({
      author: 'zero',
      level: 'debug',
      filename: logFile,
    });
    logger.info('done with object: ', {a: 1, b: 2});
    logger.info({c: 3, d: 4});
    setTimeout(function() {
      fs.readFile(logFile, 'utf8', (err, data) => {
        if (err) {
          done(err);
        }
        assert(data.indexOf('"author":"ZERO"') !== -1);
        assert(data.indexOf('"message":"done with object: "') !== -1);
        assert(data.indexOf('"meta":{"a":1,"b":2}') !== -1);
        assert(data.indexOf('"meta":{"c":3,"d":4}') !== -1);
        done();
      });
    }, 500);
  });

  it('log as different authors', function(done) {
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
    loggers.one.info('message from author one');
    loggers.two.info('message from author two');

    setTimeout(function() {
      fs.readFile(logFile, 'utf8', (err, data) => {
        if (err) {
          done(err);
        }
        assert(data.indexOf('"author":"ONE"') !== -1);
        assert(data.indexOf('"author":"TWO"') !== -1);
        done();
      });
    }, 500);
  });
});
