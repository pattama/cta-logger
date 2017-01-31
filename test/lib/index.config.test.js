'use strict';
const o = require('../common');
let logger;

describe('configuration', function() {
  it('should load default config', function() {
    logger = new o.Lib();
    o.assert.equal(logger.transports.console.level, 'silly');
    o.assert.equal(logger.transports.file.level, 'silly');
    logger = null;
  });

  it('console: false / file: true / level: silly', function() {
    logger = new o.Lib(null, {
      name: 'logger',
      properties: {
        level: 'silly',
        console: false,
        file: true,
      },
    });
    o.assert(logger.transports);
    o.assert(!logger.transports.console);
    o.assert(logger.transports.file);
    o.assert.equal(logger.transports.file.level, 'silly');
  });

  it('console: true / file: false / level: verbose', function() {
    logger = new o.Lib(null, {
      name: 'logger',
      properties: {
        level: 'verbose',
        console: true,
        file: false,
      },
    });
    o.assert(logger.transports);
    o.assert(!logger.transports.file);
    o.assert(logger.transports.console);
    o.assert.equal(logger.transports.console.level, 'verbose');
  });
});
