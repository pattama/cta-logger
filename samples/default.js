'use strict';

const Logger = require('cta-logger');
const logger = new Logger();
const foo = logger.author('foo');
const bar = logger.author('bar');
logger.info('Hi there');
// 2016-07-29T16:07:05.259Z - info - DESKTOP-8ONSCVQ - UNKNOWN - "Hi there"
foo.info('Hi, i am foo');
// 2016-07-29T16:07:05.263Z - info - DESKTOP-8ONSCVQ - FOO - "Hi, i am foo"
bar.info('Hi, and i am bar');
// 2016-07-29T16:07:05.264Z - info - DESKTOP-8ONSCVQ - BAR - "Hi, and i am bar"
