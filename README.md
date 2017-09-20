# cta-logger [ ![build status](https://git.sami.int.thomsonreuters.com/compass/cta-logger/badges/master/build.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-logger/commits/master) [![coverage report](https://git.sami.int.thomsonreuters.com/compass/cta-logger/badges/master/coverage.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-logger/commits/master)

Logger Modules for Compass Test Automation, One of Libraries in CTA-OSS Framework

## General Overview

### Overview

* The loggers, which are provided in this module, implementing [winston](https://github.com/winstonjs/winston). 

* Multiple loggers are necessary and can instantiated with different configurations using [winston.Container](https://github.com/winstonjs/winston/blob/master/README.md#working-with-multiple-loggers-in-winston) features.

* Each logger has _two_ transports: **Console** and **File**:

  Console Transport Example:

  ```javascript
  2017-09-09T13:10:25.904Z - debug - HOSTNAME - APP - AUTHOR - "Log file set to: C:\\Users\\Panit.Tuangsuwan\\AppData\\Local\\Temp\\cta-logger-silly"
  2017-09-09T13:10:25.905Z - error - HOSTNAME - APP - AUTHOR - "silly error message"
  2017-09-09T13:10:25.906Z - warn - HOSTNAME - APP - AUTHOR - "silly warn message"
  2017-09-09T13:10:25.907Z - info - HOSTNAME - APP - AUTHOR - "silly info message"
  2017-09-09T13:10:25.908Z - verbose - HOSTNAME - APP - AUTHOR - "silly verbose message"
  2017-09-09T13:10:25.909Z - debug - HOSTNAME - APP - AUTHOR - "silly debug message"
  2017-09-09T13:10:25.910Z - silly - HOSTNAME - APP - AUTHOR - "silly silly message"
  ```

  File Transport Example:

  ```javascript
  {"timestamp":"2017-09-09T13:10:25.904Z", "level":"debug", "hostname":"HOSTNAME", "application":"APP", "author":"AUTHOR", "message":"Log file set to: C:\\Users\\Panit.Tuangsuwan\\AppData\\Local\\Temp\\cta-logger-silly"}
  {"timestamp":"2017-09-09T13:10:25.905Z", "level":"error", "hostname":"HOSTNAME", "application":"APP", "author":"AUTHOR", "message":"silly error message"}
  {"timestamp":"2017-09-09T13:10:25.906Z", "level":"warn", "hostname":"HOSTNAME", "application":"APP", "author":"AUTHOR", "message":"silly warn message"}
  {"timestamp":"2017-09-09T13:10:25.907Z", "level":"info", "hostname":"HOSTNAME", "application":"APP", "author":"AUTHOR", "message":"silly info message"}
  {"timestamp":"2017-09-09T13:10:25.908Z", "level":"verbose", "hostname":"HOSTNAME", "application":"APP", "author":"AUTHOR", "message":"silly verbose message"}
  {"timestamp":"2017-09-09T13:10:25.909Z", "level":"debug", "hostname":"HOSTNAME", "application":"APP", "author":"AUTHOR", "message":"silly debug message"}
  {"timestamp":"2017-09-09T13:10:25.9010Z", "level":"silly", "hostname":"HOSTNAME", "application":"APP", "author":"AUTHOR", "message":"silly silly message"}
  ```

## Guidelines

We aim to give you brief guidelines here.

### 1. Instantiation

A logger can be instantiated in two different ways:
* [Inside Brick](#inside-brick)
* [Outside Brick (anywhere)](#outside-brick-anywhere-)

#### Inside Brick

Inside Brick, the logger is _instantiated by **Cement** using the configuration entry_ and _provided to the Brick via **CementHelper**_.
It's usually available in the **Brick** level as a dependency of **cementHelper** : **cementHelper.dependencies**.

```javascript
'use strict';

const Brick = require('cta-brick');

class MyBrick extends Brick {
  constructor(cementHelper, config) {
    // By calling Brick constructor (super) and providing the config, the 'Brick-level' logger is instantiated.
    super(cementHelper, config);

    // At this point, the logger instance is avaliable and can be accessed.
    this.logger.info('Initializing a new instance of Brick with config: ', config);
    ...
  }
}
```

In the Brick, __this.logger__ is a reference to __cementHelper.dependencies.logger__ (see **_cta-brick_**).

#### Outside Brick (anywhere)

Outside Brick or _**anywhere**_, the logger can be instantiated with _default_ or _custom_ options.

##### default options

```javascript
'use strict';

const Logger = require('cta-logger');

const logger = new Logger();

logger.info('Initialized a new instance of Logger with default config');
```

##### custom options

```javascript
'use strict';

const Logger = require('cta-logger');

const logger = new Logger(null, {
  name: 'logger',
  properties: {
    filename: __dirname + '/default.log',
    level: 'silly',
  },
});

logger.info('Initialized a new instance of Logger with custom config');
```

### 2. Logger Configuration

**Logger Configuration** is provided when a logger is being instantiated.

```javascript
const logger = new Logger(null, LoggerConfiguration);
```

#### Logger Configuration Structure

```javascript
const LoggerConfiguration = {
  name: string,
  properties: {
    level: string,
    console: boolean,
    file: boolean,
    filename: string
  }
};
```

* __name__ defines the name of logger
* __properties__ defines how a logger is setup
  * __level__ defines the log level to be used (see [_Log Levels_](#3-log-levels))
  * __console__ defines whether a console transport log is enabled
  * __file__ defines whether a console transport log is enabled
  * __filename__ defines a full path of logs file to be used






### 3. Log Levels

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

### 4. Log Output Author Name

By default, author of the log output is set to UNKNOWN, to override it you can either

* ask for a new logger instance

````javascript
const Logger = require('cta-logger');
const logger = new Logger();
const foo = logger.author('foo');
const bar = logger.author('bar');
logger.info('Hi there');
// 2016-07-29T16:07:05.259Z - info - DESKTOP-8ONSCVQ - UNKNOWN - UNKNOWN - "Hi there"
foo.info('Hi, i am foo');
// 2016-07-29T16:07:05.263Z - info - DESKTOP-8ONSCVQ - UNKNOWN - FOO - "Hi, i am foo"
bar.info('Hi, and i am bar');
// 2016-07-29T16:07:05.264Z - info - DESKTOP-8ONSCVQ - UNKNOWN - BAR - "Hi, and i am bar"
````

* or instantiate it with author parameter

````javascript
const Logger = require('cta-logger');
const logger = new Logger(null, {
    properties: {
        author: 'something',
    },
});
logger.info('Hi');
// 2016-07-29T16:10:05.123Z - info - DESKTOP-8ONSCVQ - UNKNOWN - SOMETHING - "Hi"
````

### 5. Log Output Application Name

By default, application name is set to UNKNOWN, to override it you need cement dependency to access application configuration

````javascript
const Logger = require('cta-logger');
const logger = new Logger({
  cement: {
    configuration: {
      name: 'my app',
    },
  },
}, null);
const foo = logger.author('foo');
const bar = logger.author('bar');

logger.info('Starting app...');
// 2016-08-11T12:31:48.258Z - info - DESKTOP-8ONSCVQ - MY APP - UNKNOWN - "Starting app..."

foo.info('Hi, i am foo');
// 2016-08-11T12:31:48.262Z - info - DESKTOP-8ONSCVQ - MY APP - FOO - "Hi, i am foo"

bar.info('Hi, and i am bar');
// 2016-08-11T12:31:48.263Z - info - DESKTOP-8ONSCVQ - MY APP - BAR - "Hi, and i am bar"
````