'use strict';
const o = require('../common');
const logFile = __dirname + o.path.sep + 'json.log';

describe('main', function() {
  const consoleHook = new o.StreamHook();
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
    const logger = new o.Lib();
    const defaultFileName = logger.transports.file.dirname + o.path.sep + logger.transports.file.filename;
    const text = 'It is about ' + new Date() + ' right now!';
    logger.info(text);
    const r = consoleHook.captured();
    const logElts = r.split(' - ');
    o.assert.equal(logElts.length, 6, 'Log on the console, incorrect tokens count');
    o.assert(/info/.test(logElts[1]), 'Log on the console, wrong level "' + logElts[1] + '"');
    o.assert.equal(logElts[3], 'UNKNOWN', 'Log on the console, wrong application name "' + logElts[3] + '"');
    o.assert.equal(logElts[4], 'UNKNOWN', 'Log on the console, wrong author "' + logElts[4] + '"');
    o.assert.equal(logElts[5].indexOf(text), 1, 'Log on the console, wrong text "' + logElts[5] + '"');
    setTimeout(function() {
      const data = o.fs.readFileSync(defaultFileName).toString();
      o.assert(data.indexOf(text) !== -1);
      done();
    }, 100);
  });

  it('should log to custom config', function(done) {
    const logger = new o.Lib({
      cement: {
        configuration: {
          name: 'my app',
        },
      },
    }, {
      name: 'logger',
      properties: {
        author: 'zero',
        level: 'info',
        file: true,
        filename: logFile,
      },
    });
    const text = 'It is about ' + new Date() + ' right now!';
    logger.info(text);
    logger.debug('should be ignored');
    setTimeout(function() {
      const data = o.fs.readFileSync(logFile).toString();
      console.log('data: ', data);
      o.assert(data.indexOf('MY APP') !== -1);
      o.assert(data.indexOf('ZERO') !== -1);
      o.assert(data.indexOf(text) !== -1);
      o.assert(data.indexOf('should be ignored') === -1);
      done();
    }, 100);
  });

  it('should log meta objects', function(done) {
    const logger = new o.Lib(null, {
      name: 'logger',
      properties: {
        author: 'zero',
        level: 'debug',
        file: true,
        filename: logFile,
      },
    });
    logger.info('done with object: ', {a: 1, b: 2});
    logger.info({c: 3, d: 4});
    setTimeout(function() {
      const data = o.fs.readFileSync(logFile).toString();
      o.assert(data.indexOf('"author":"ZERO"') !== -1);
      o.assert(data.indexOf('"message":"done with object: "') !== -1);
      o.assert(data.indexOf('"meta":{"a":1,"b":2}') !== -1);
      o.assert(data.indexOf('"meta":{"c":3,"d":4}') !== -1);
      done();
    }, 100);
  });

  it('log as different authors', function(done) {
    const logger = new o.Lib(null, {
      name: 'logger',
      properties: {
        level: 'debug',
        filename: logFile,
      },
    });
    const loggers = {
      one: logger.author('one'),
      two: logger.author('two'),
    };
    logger.info('message from default logger');
    loggers.one.info('message from author one');
    loggers.two.info('message from author two');

    setTimeout(function() {
      const data = o.fs.readFileSync(logFile).toString();
      o.assert(data.indexOf('"author":"UNKNOWN"') !== -1);
      o.assert(data.indexOf('"author":"ONE"') !== -1);
      o.assert(data.indexOf('"author":"TWO"') !== -1);
      done();
    }, 100);
  });
});
