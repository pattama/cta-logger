'use strict';
const assert = require('chai').assert;
const loggerLib = require('../../../lib');

describe('index - configuration', function() {
  it('should load default config', function() {
    let logger = loggerLib();
    assert(logger.transports);
    assert(logger.transports.console);
    assert(logger.transports.file);
    assert.equal(logger.transports.console.level, 'debug');
    assert.equal(logger.transports.file.level, 'debug');
    logger = null;
  });

  it('console: false / file: true / level: silly', function() {
    let logger = loggerLib({
      level: 'silly',
      console: false,
      file: true,
    });
    assert(logger.transports);
    assert(!logger.transports.console);
    assert(logger.transports.file);
    assert.equal(logger.transports.file.level, 'silly');
    logger = null;
  });

  it('console: true / file: false / level: verbose', function() {
    let logger = loggerLib({
      level: 'verbose',
      console: true,
      file: false,
    });
    assert(logger.transports);
    assert(!logger.transports.file);
    assert(logger.transports.console);
    assert.equal(logger.transports.console.level, 'verbose');
    logger = null;
  });
});
