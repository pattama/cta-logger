'use strict';

const Logger = require('../lib');
const logger = new Logger();
const foo = logger.author('foo');
const bar = logger.author('bar');
logger.info('Hi there');
// 2016-08-11T12:26:43.038Z - info - DESKTOP-8ONSCVQ - UNKNOWN - UNKNOWN - "Hi there"
foo.info('Hi, i am foo');
// 2016-08-11T12:26:43.042Z - info - DESKTOP-8ONSCVQ - UNKNOWN - FOO - "Hi, i am foo"
bar.info('Hi, and i am bar');
// 2016-08-11T12:26:43.043Z - info - DESKTOP-8ONSCVQ - UNKNOWN - BAR - "Hi, and i am bar"
