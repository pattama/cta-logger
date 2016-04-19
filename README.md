# cta-logger
## How to use it
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
    transports: [
      {
        type: 'File',
        options: {
          name: 'default',
          filename: './default.log',
          level: 'info',
        },
      },
    ],
});
logger.info('Starting app...');
logger.log('info', 'Loading dependencies... please wait!');
logger.debug('All dependencies have been loaded.');
logger.error('An error has occurred!');
````

See https://github.com/winstonjs/winston for more details 