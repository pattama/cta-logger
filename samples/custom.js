'use strict';
const os = require('os');
const path = require('path');
const Logger = require('cta-logger');
const filename = os.tmpDir() + path.sep + 'default.txt';
const logger = new Logger({
  cement: {
    configuration: {
      name: 'my app',
    },
  },
}, {
  properties: {
    filename: filename,
  },
});
const foo = logger.author('foo');

const bar = logger.author('bar');

logger.info('Starting app...');
// 2016-08-11T12:31:48.258Z - info - DESKTOP-8ONSCVQ - MY APP - UNKNOWN - "Starting app..."
foo.info('Hi, i am foo');
// 2016-08-11T12:31:48.262Z - info - DESKTOP-8ONSCVQ - MY APP - FOO - "Hi, i am foo"
bar.info('Hi, and i am bar');
// 2016-08-11T12:31:48.263Z - info - DESKTOP-8ONSCVQ - MY APP - BAR - "Hi, and i am bar"
