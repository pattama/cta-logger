'use strict';

const o = require('../common');

describe.skip('allow different ways to call logger', () => {
  it('deprecated - default params', () => {
    const logger = o.Lib();
    o.assert.property(logger, 'info');
  });
  it('deprecated - custom params', () => {
    const logger = o.Lib({author: 'deprecated', filename: o.os.tmpDir() + o.path.sep + 'deprecated.log'});
    o.assert.property(logger, 'info');
  });
  it('new - default params', () => {
    const logger = new o.Lib();
    o.assert.property(logger, 'info');
  });
  it('new - custom params', () => {
    const logger = new o.Lib({author: 'new', filename: o.os.tmpDir() + o.path.sep + 'new.log'});
    o.assert.property(logger, 'info');
  });
  it('create', () => {
    const logger = new o.Lib();
    const bar = logger.author('bar');
    o.assert.property(bar, 'info');
  });
});
