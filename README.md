# cta-logger
This is the logger module for cta project

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
A logger is instantiated by Cement using its configuration, passed to CementHelper then to the Brick
````javascript
'use strict';
const Brick = require('cta-brick');
class MyBrick extends Brick {
  constructor(cementHelper, config) {
    super(cementHelper, config);
    // At this point you can access the logger instance
    this.logger.info('Instantiated new Brick with config: ', config);
    ...
````

### Outside Bricks

#### default logger options
````javascript
'use strict';
const loggerLib = require('cta-logger');
const logger = loggerLib();
logger.info('Instantiated new logger with default config');
````

#### custom logger options
````javascript
const loggerLib = require('cta-logger');
const config = {
   author: 'cta-logger',
   filename: __dirname + '/default.log',
   level: 'silly',
};
const logger = loggerLib(config);
logger.info('Instantiated new logger with custom config', config);
```` 
Supported options are:
- author: author of the log, basically brick name
- level: log level (see levels section)
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