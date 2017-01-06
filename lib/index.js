'use strict';

const winston = require('winston');
const common = require('cta-common');
const os = require('os');
const path = require('path');
const _ = require('lodash');

/**
 * logger module
 * @param {object} configuration
 * @param {object} configuration.properties
 * @param {string} configuration.properties.author - author of the log to output (basically name of brick/module/component...), default to UNKNOWN
 * @param {string} configuration.properties.level - log level (error, warn, info, verbose, debug, silly), default to debug
 * @param {boolean} configuration.properties.console - weather to log to console or not, default to true
 * @param {boolean} configuration.properties.file - weather to log to file or not, default to true
 * @param {string} configuration.properties.filename - full path to log file name for json output
 * @param {object} dependencies
 * @return {object} - logger instance
 * */

function Logger(dependencies, configuration) {
  let application;
  if (dependencies && typeof dependencies === 'object' && dependencies.hasOwnProperty('cement')
    && dependencies.cement.configuration.name && typeof dependencies.cement.configuration.name === 'string') {
    application = dependencies.cement.configuration.name.toUpperCase();
  } else {
    application = 'UNKNOWN';
  }
  const defaultLogFile = os.tmpDir() + path.sep + 'cta-default-logger.log';
  const defaults = {
    name: 'logger',
    properties: {
      author: 'UNKNOWN',
      level: 'silly',
      console: true,
      file: true,
      filename: defaultLogFile,
    },
  };
  const _configuration = common.validate(configuration, {
    type: 'object',
    optional: true,
    defaultTo: defaults,
  }).output;
  _configuration.name = common.validate(_configuration.name, {type: 'string', optional: true, defaultTo: defaults.name}).output;
  _configuration.properties = common.validate(_configuration.properties, {
    type: 'object',
    optional: true,
    defaultToOptionals: true,
    items: {
      author: {optional: true, type: 'string', defaultTo: defaults.properties.author},
      level: {optional: true, type: 'string', defaultTo: defaults.properties.level},
      console: {optional: true, type: 'boolean', defaultTo: defaults.properties.console},
      file: {optional: true, type: 'boolean', defaultTo: defaults.properties.file},
      filename: {optional: true, type: 'string', defaultTo: defaults.properties.filename},
    },
  }).output;
  const _config = _configuration.properties;
  const _author = _config.author.toUpperCase();

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
        data.push(application);
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
        data.application = application;
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
    const conf = _.cloneDeep(_configuration);
    conf.properties.author = id;
    conf.name = id + '-logger';
    return new Logger(dependencies, conf);
  };
  if (_config.file) {
    logger.debug('Log file set to: ', logger.transports.file.dirname + path.sep + logger.transports.file.filename);
  }
  return logger;
}

module.exports = Logger;
