# cta-logger
## How to use it
### Using in a Brick
A logger is instantiated by Cement using its configuration, passed to CementHelper then to the Brick
````javascript
'use strict';
const Brick = require('cta-brick');
class MyBrick extends Brick {
  constructor(cementHelper, config) {
    super(cementHelper, config);
    this.logger.info('Instantiated new Brick with config: ', config);
    ...
````
### Using default logger
````javascript
'use strict';
const loggerLib = require('cta-logger');
const logger = loggerLib();
logger.info('Hi there...');
logger.log('info', 'Hi again!');
logger.error('An error occured!');
````
### Using custom logger
````javascript
const loggerLib = require('cta-logger');
const logger = loggerLib({
    author: 'cta-logger',
    filename: __dirname + '/default.log',
    level: 'silly',
});
logger.info('Starting app...');
logger.log('info', 'Loading dependencies... please wait!');
logger.debug('All dependencies have been loaded.');
logger.error('An error has occurred!');
```` 
## Log levels
Supported levels by priority: error, warn, info, verbose, debug, silly
logger.log(level, 'your message');

