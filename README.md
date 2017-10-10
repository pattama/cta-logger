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
  {"timestamp":"2017-09-09T13:10:25.910Z", "level":"silly", "hostname":"HOSTNAME", "application":"APP", "author":"AUTHOR", "message":"silly silly message"}
  ```

## Guidelines

We aim to give you brief guidelines here.

1. [Instantiation](#1-instantiation)
1. [Logger Configuration](#2-logger-configuration)
1. [Log Levels](#3-log-levels)
1. [Log Format](#4-log-format)
1. [Author Name in Log Output](#5-author-name-in-log-output)
1. [Application Name in Log Output](#6-application-name-in-log-output)

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

[back to top](#guidelines)

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
    author: string,
    console: boolean,
    file: boolean,
    filename: string
  }
};
```

* __name__ defines the name of logger
* __properties__ defines how a logger is setup
  * __level__ defines the log level to be used (see [_Log Levels_](#3-log-levels))
  * __author__ defines [__author name__](#5-author-name-in-log-output) in log output
  * __console__ defines whether a console transport log is enabled
  * __file__ defines whether a console transport log is enabled
  * __filename__ defines a full path of logs file to be used

[back to top](#guidelines)

### 3. Log Levels

We aim to support these log levels : [__error__, __warn__, __info__, __verbose__, __debug__, __silly__], ordered in __priorty__.

If the logger set its level as __info__, any message logging with levels: *error*, *warn*, *info* will be logged.

If the logger set its level as __debug__, any message logging with levels: *error*, *warn*, *info*, *verbose*, *debug* will be logged. 

Level: __info__ = [__error__, __warn__, __info__, verbose, debug, silly]

Level: __debug__ = [__error__, __warn__, __info__, __verbose__, __debug__, silly]

[back to top](#guidelines)

### 4. Log Format

When it's logging, [Log Level](#3-log-levels) and a message are needed as log format. There are two log formats.

- logger.log(*log_level*, *message*) method

```javascript
logger.log('info', 'message');
logger.log('debug', 'message');
logger.log('error', 'message');
```

- logger.*loglevel*(*message*) method

```javascript
logger.info('message');
logger.debug('message');
logger.error('message');
```
Both **_logger.log('info', 'message')_** and **_logger.info('message')_** effect the same. Either is your preference.

[back to top](#guidelines)

### 5. Author Name in Log Output

The Logger has **_Author Name_** as a part of log output.

By default, the author of the log output is set to "**UNKNOWN**".

**Author Name** can be set by either _parameter in instantiating_ or _logger.author()_.

* parameter in instantiating

```javascript
'use strict';

const Logger = require('cta-logger');

const logger = new Logger(null, {
    properties: {
        author: 'cta-agent',
    },
});

logger.info('info message');
// LOG OUTPUT: 2017-09-09T13:10:25.909Z - info - HOSTNAME - UNKNOWN - CTA-AGENT - "info message"
```

* logger.author('author_name')

```javascript
'use strict';

const Logger = require('cta-logger');

const logger = new Logger();

const cta_agent = logger.author('cta-agent');
const cta_api = logger.author('cta-api');

cta_agent.info('info message');
cta_api.info('info message');
// LOG OUTPUT: 2017-09-09T13:10:25.910Z - info - HOSTNAME - UNKNOWN - CTA-AGENT - "info message"
// LOG OUTPUT: 2017-09-09T13:10:25.911Z - info - HOSTNAME - UNKNOWN - CTA-API - "info message"
```

[back to top](#guidelines)

### 6. Application Name in Log Output

The Logger has **_Application Name_** as a part of log output.

By default, the application of the log output is set to "**UNKNOWN**".

**Application Name** can be set by application configuration via cement dependency.

```javascript
'use strict';

const Logger = require('cta-logger');

const logger = new Logger({
  cement: {
    configuration: {
      name: 'cta-oss',
    },
  },
}, null);

const cta_agent = logger.author('cta-agent');
const cta_api = logger.author('cta-api');

cta_agent.info('info message');
cta_api.info('info message');
// LOG OUTPUT: 2017-09-09T13:10:25.918Z - info - HOSTNAME - CTA-OSS - CTA-AGENT - "info message"
// LOG OUTPUT: 2017-09-09T13:10:25.919Z - info - HOSTNAME - CTA-OSS - CTA-API - "info message"
```

[back to top](#guidelines)

------

## To Do

* decoupling **cta-logger** and **winston**