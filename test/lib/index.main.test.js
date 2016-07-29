'use strict';
const o = require('../common');
const logFile = __dirname + o.path.sep + 'json.log';
const StreamHook = require('../StreamHook');

describe('main', function() {
  const consoleHook = new StreamHook();
  before(function(done) {
    try {
      o.fs.unlink(logFile, function() {
        done();
      });
    } catch (e) {
      done();
    }
  });

  beforeEach(function() {
    consoleHook.startCapture(process.stdout);
  });

  afterEach(function() {
    consoleHook.stopCapture();
  });

  it('should log to default config', function(done) {
    const logger = new o.Lib(null, null, 'test');
    const defaultFileName = logger.transports.file.dirname + o.path.sep + logger.transports.file.filename;
    const text = 'It is about ' + new Date() + ' right now!';
    logger.info(text);
    const r = consoleHook.captured();
    const logElts = r.split(' - ');
    o.assert.equal(logElts.length, 5, 'Log on the console, incorrect tokens count');
    o.assert(/info/.test(logElts[1]), 'Log on the console, wrong level "' + logElts[1] + '"');
    o.assert.equal(logElts[3], 'TEST', 'Log on the console, wrong author "' + logElts[3] + '"');
    o.assert.equal(logElts[4].indexOf(text), 1, 'Log on the console, wrong text "' + logElts[4] + '"');
    setTimeout(function() {
      o.fs.readFile(defaultFileName, 'utf8', (err, data) => {
        if (err) {
          done(err);
        }
        o.assert(data.indexOf(text) !== -1);
        done();
      });
    }, 500);
  });

  it('log to custom config', function(done) {
    const logger = new o.Lib({
      level: 'info',
      file: true,
      filename: logFile,
    }, null, 'zero');
    const text = 'It is about ' + new Date() + ' right now!';
    logger.info(text);
    logger.debug('should be ignored');
    setTimeout(function() {
      o.fs.readFile(logFile, 'utf8', (err, data) => {
        if (err) {
          done(err);
        }
        o.assert(data.indexOf('ZERO') !== -1);
        o.assert(data.indexOf(text) !== -1);
        o.assert(data.indexOf('should be ignored') === -1);
        done();
      });
    }, 500);
  });

  it('should log meta objects', function(done) {
    const logger = new o.Lib({
      level: 'debug',
      file: true,
      filename: logFile,
    }, null, 'zero');
    logger.info('done with object: ', {a: 1, b: 2});
    logger.info({c: 3, d: 4});
    setTimeout(function() {
      o.fs.readFile(logFile, 'utf8', (err, data) => {
        if (err) {
          done(err);
        }
        o.assert(data.indexOf('"author":"ZERO"') !== -1);
        o.assert(data.indexOf('"message":"done with object: "') !== -1);
        o.assert(data.indexOf('"meta":{"a":1,"b":2}') !== -1);
        o.assert(data.indexOf('"meta":{"c":3,"d":4}') !== -1);
        done();
      });
    }, 500);
  });

  it('log as different authors', function(done) {
    const logger = new o.Lib({
      level: 'debug',
      filename: logFile,
    });
    const loggers = {
      one: logger.author('one'),
      two: logger.author('two'),
    };
    logger.info('message from default logger');
    loggers.one.info('message from author one');
    loggers.two.info('message from author two');

    setTimeout(function() {
      o.fs.readFile(logFile, 'utf8', (err, data) => {
        if (err) {
          done(err);
        }
        o.assert(data.indexOf('"author":"UNKNOWN"') !== -1);
        o.assert(data.indexOf('"author":"ONE"') !== -1);
        o.assert(data.indexOf('"author":"TWO"') !== -1);
        done();
      });
    }, 500);
  });
});
