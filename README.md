# Tool cta-logger
This is the logger Tool for cta project

## How it works
This logger uses [winston](https://github.com/winstonjs/winston) module

It can instantiate multiple loggers with different configurations using winston.Container features

Each logger has two transports: console & file

Console output:

![console](/readme/console.png)

File output:

![file](/readme/file.png)

## Instantiation

### Inside Bricks
A logger is instantiated by Cement using the configuration entry, then passed to the Brick
It is then available in the Brick level as a dependency of cementHelper: cementHelper.dependencies
````javascript
'use strict';
const Brick = require('cta-brick');
class MyBrick extends Brick {
  constructor(cementHelper, config) {
    super(cementHelper, config);
    // At this point you can access the logger instance
    this.logger.info('Instantiated new Brick with config: ', config); // this.logger is a shortcut to cementHelper.dependencies.logger, see cta-brick
    ...
````

### Outside Bricks

#### default logger options
````javascript
'use strict';
const Logger = require('cta-logger');
const logger = new Logger();
logger.info('Instantiated new logger with default config');
````

#### custom logger options
````javascript
const Logger = require('cta-logger');
const logger = new Logger(null, {
    name: 'logger',
    properties: {
        filename: __dirname + '/default.log',
        level: 'silly',
    },
});
logger.info('Instantiated new logger with custom config', config);
```` 
Supported options are:
- level: log level (see levels section)
- console: true or false
- file: true or false
- filename: full path to a log file where to save logs in json format 

## Log levels
Supported levels by priority: error, warn, info, verbose, debug, silly

````javascript
logger.log('info', 'your message');
logger.info('Starting app...');

logger.log('debug', 'Loading dependencies... please wait!');
logger.debug('All dependencies have been loaded.');

logger.error('An error has occurred!');
````

If you configure your logger with a level 'info' you will see only logged message with levels: error, warn, info

If you configure your logger with a level 'debug' you will see only logged message with levels: error, warn, info, verbose, debug

..etc

### Log output author or id
By default, author of the log output is set to UNKNOWN, to override it you can either

* ask for a new logger instance

````javascript
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
````

* or instantiate it with author parameter

````javascript
const Logger = require('cta-logger');
const logger = new Logger(null, null, 'something');
logger.info('Hi');
// 2016-07-29T16:10:05.123Z - info - DESKTOP-8ONSCVQ - SOMETHING - "Hi"
````