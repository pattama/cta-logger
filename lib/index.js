'use strict';

const winston = require('winston');
const tools = require('cta-common');
const os = require('os');
const path = require('path');
// const _ = require('lodash');

/**
 * logger module
 * @param {object} config - configuration object
 * @param {string} config.author - author of the log to output (basically name of brick/module/component...), default to UNKNOWN
 * @param {string} config.level - log level (error, warn, info, verbose, debug, silly), default to debug
 * @param {boolean} config.console - weather to log to console or not, default to true
 * @param {boolean} config.file - weather to log to file or not, default to true
 * @param {string} config.filename - full path to log file name for json output
 * @param {object} dependencies
 * @param {string} author
 * @return {object} - logger instance
 * */

function Logger(config, dependencies, author) {
  const result = tools.validate(config, {
    level: {optional: true, type: 'string', defaultTo: 'debug'},
    console: {optional: true, type: 'boolean', defaultTo: true},
    file: {optional: true, type: 'boolean', defaultTo: true},
    filename: {optional: true, type: 'string', defaultTo: os.tmpDir() + path.sep + 'cta-default-logger.log'},
  }, {throwErr: false});

  const _config = result.output;
  const _author = author ? author.toUpperCase() : 'UNKNOWN';

  if (winston.loggers.has(_author)) {
    winston.loggers.close(_author);
  }

  const _transports = {};

  // console transport?
  if (_config.console) {
    _transports.console = {
      level: _config.level,
      formatter: (options) => {
        const data = [];
        data.push(new Date().toISOString());
        data.push(winston.config.colorize(options.level, options.level));
        data.push(os.hostname());
        data.push(_author);
        if (options.message) {
          data.push(JSON.stringify(options.message));
        }
        if (options.meta && Object.keys(options.meta).length) {
          data.push(JSON.stringify(options.meta));
        }
        return data.join(' - ');
      },
    };
  }

  // json file transport?
  if (_config.file) {
    _transports.file = {
      name: 'file',
      level: _config.level,
      filename: _config.filename,
      json: false, // we'll generate custom json via the formatter
      formatter: (options) => {
        const data = {};
        data.timestamp = new Date().toISOString();
        data.level = options.level;
        data.hostname = os.hostname();
        data.author = _author;
        if (options.message) {
          data.message = options.message;
        }
        if (options.meta && Object.keys(options.meta).length) {
          data.meta = options.meta;
        }
        return JSON.stringify(data);
      },
    };
  }
  winston.loggers.add(_author, _transports);
  const logger = winston.loggers.get(_author);
  // Fix https://github.com/winstonjs/winston/issues/175
  if (!_config.console) {
    logger.remove(winston.transports.Console);
  }
  logger.author = function(id) {
    return new Logger(_config, dependencies, id);
  };
  return logger;
}

/*function _construct(constr, args) {
  return new (Function.prototype.bind.apply(constr, [null].concat(args)));
}

exports = module.exports = function LoggerFn() {
  return _construct(Logger.prototype.constructor, Array.prototype.slice.call(arguments));
};*/

module.exports = Logger;
