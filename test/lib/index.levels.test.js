'use strict';
// error, warn, info, verbose, debug, silly
const o = require('../common');
describe('levels', () => {
  it('debug as default level', (done) => {
    const logFile = o.os.tmpDir() + o.path.sep + o.shortid.generate();
    const logger = new o.Lib(null, {
      name: 'logger',
      properties: {
        level: 'debug',
        console: false,
        file: true,
        filename: logFile,
      },
    });
    const error = 'error level' + o.shortid.generate();
    const warn = 'warn level' + o.shortid.generate();
    const info = 'info level' + o.shortid.generate();
    const verbose = 'verbose level' + o.shortid.generate();
    const debug = 'debug level' + o.shortid.generate();
    const silly = 'silly level' + o.shortid.generate();
    logger.log('error', error);
    logger.log('warn', warn);
    logger.log('info', info);
    logger.log('verbose', verbose);
    logger.log('debug', debug);
    logger.log('silly', silly);
    setTimeout(() => {
      const data = o.fs.readFileSync(logFile).toString();
      o.fs.unlinkSync(logFile);
      o.assert.ok(data.indexOf(error) > -1);
      o.assert.ok(data.indexOf(warn) > -1);
      o.assert.ok(data.indexOf(info) > -1);
      o.assert.ok(data.indexOf(verbose) > -1);
      o.assert.ok(data.indexOf(debug) > -1);
      o.assert.ok(data.indexOf(silly) === -1);
      done();
    }, 100);
  });
  it('console: false / file: true / level: silly', (done) => {
    const logFile = o.os.tmpDir() + o.path.sep + o.shortid.generate();
    const logger = new o.Lib(null, {
      name: 'logger',
      properties: {
        level: 'warn',
        console: false,
        file: true,
        filename: logFile,
      },
    });
    const loggers = {
      one: logger.author('one'),
      two: logger.author('two'),
    };
    const error = 'error level' + o.shortid.generate();
    const warn = 'warn level' + o.shortid.generate();
    const info = 'info level' + o.shortid.generate();
    const verbose = 'verbose level' + o.shortid.generate();
    const debug = 'debug level' + o.shortid.generate();
    const silly = 'silly level' + o.shortid.generate();
    loggers.one.log('error', error);
    loggers.two.log('warn', warn);
    loggers.one.log('info', info);
    loggers.two.log('verbose', verbose);
    loggers.one.log('debug', debug);
    loggers.two.log('silly', silly);
    setTimeout(() => {
      const data = o.fs.readFileSync(logFile).toString();
      o.fs.unlinkSync(logFile);
      o.assert.ok(data.indexOf(error) > -1);
      o.assert.ok(data.indexOf(warn) > -1);
      o.assert.ok(data.indexOf(info) === -1);
      o.assert.ok(data.indexOf(verbose) === -1);
      o.assert.ok(data.indexOf(debug) === -1);
      o.assert.ok(data.indexOf(silly) === -1);
      done();
    }, 100);
  });
});
