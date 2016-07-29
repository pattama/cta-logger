'use strict';

const assert = require('chai').assert;
const loggerLib = require('../../../lib');
const path = require('path');
const fs = require('fs');
const logFile = __dirname + path.sep + 'json.log';
const StreamHook = require('../../StreamHook');

describe('index - main', function() {
  const consoleHook = new StreamHook();
  before(function(done) {
    try {
      fs.unlink(logFile, function() {
        done();
      });
    } catch (e) {
      done();
    }
  });

  beforeEach(function() {
    consoleHook.startCapture(process.stdout);
  });

  afterEach(function(){
    consoleHook.stopCapture();
  });

  it('should log to default config', function(done) {
    const logger = loggerLib('TEST');
    const defaultFileName = logger.transports.file.filename;
    const text = 'It is about ' + new Date() + ' right now!';
    logger.info(text);
    const r = consoleHook.captured();
    const logElts = r.split(' - ');
    assert.equal(logElts.length, 5, 'Log on the console, incorrect tokens count');
    assert(/info/.test(logElts[1]), 'Log on the console, wrong level "' + logElts[1] + '"');
    assert.equal(logElts[3], 'TEST', 'Log on the console, wrong author "' + logElts[3] + '"');
    assert.equal(logElts[4].indexOf(text), 1, 'Log on the console, wrong text "' + logElts[4] + '"');
    setTimeout(function() {
      fs.readFile(defaultFileName, 'utf8', (err, data) => {
        if (err) {
          done(err);
        }
        assert(data.indexOf(text) !== -1);
        done();
      });
    }, 500);
  });

  it('log to custom config', function(done) {
    const logger = loggerLib({
      author: 'zero',
      level: 'info',
      file: true,
      filename: logFile,
    });
    const text = 'It is about ' + new Date() + ' right now!';
    logger.info(text);
    logger.debug('should be ignored');
    setTimeout(function() {
      fs.readFile(logFile, 'utf8', (err, data) => {
        if (err) {
          done(err);
        }
        assert(data.indexOf('ZERO') !== -1);
        assert(data.indexOf(text) !== -1);
        assert(data.indexOf('should be ignored') === -1);
        done();
      });
    }, 500);
  });

  it('should log meta objects', function(done) {
    const logger = loggerLib({
      author: 'zero',
      level: 'debug',
      file: true,
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
