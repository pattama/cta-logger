'use strict';
const Lib = require('../../../lib');
const assert = require('chai').assert;
const os = require('os');
const path = require('path');

describe('allow different ways to call logger', () => {
  it('deprecated - default params', () => {
    const logger = Lib();
    assert.property(logger, 'info');
  });
  it('deprecated - custom params', () => {
    const logger = Lib({author: 'deprecated', filename: os.tmpDir() + path.sep + 'deprecated.log'});
    assert.property(logger, 'info');
  });
  it('new - default params', () => {
    const logger = new Lib();
    assert.property(logger, 'info');
  });
  it('new - custom params', () => {
    const logger = new Lib({author: 'new', filename: os.tmpDir() + path.sep + 'new.log'});
    assert.property(logger, 'info');
  });
  it('create', () => {
    const logger = new Lib();
    const bar = logger.create('bar');
    assert.property(bar, 'info');
  });
});
