'use strict';

const winston = require('winston');
const os = require('os');
const util = require('util');
const path = require('path');

 /**
 * logger module
 * @param {object} config - configuration object
 * @param {string} config.author - author of the log to output: brick/module/component name
 * @param {string} config.level - log level: error, warn, info, verbose, debug, silly
 * @param {string} config.filename - log filename for json output
 * @return {object} - logger instance
 * */
exports = module.exports = function(config) {
  const timestamp = new Date().toISOString();
  const author = config && config.author ? config.author.toUpperCase() : 'UNKNOWN';
  const level = config && config.level || 'silly';
  const filename = config && config.filename || os.tmpDir() + path.sep + 'cta-default-logger-' + Date.now() + '.log';
  winston.loggers.add(author, {
    console: {
      level: level,
      formatter: function(options) {
        const data = [];
        data.push(timestamp);
        data.push(winston.config.colorize(options.level, options.level));
        data.push(os.hostname());
        data.push(author);
        if (options.message !== undefined) {
          data.push(util.inspect(options.message, false, 5, false));
        }
        if (options.meta && Object.keys(options.meta).length) {
          data.push(util.inspect(options.meta, false, 5, false));
        }
        return data.join(' - ');
      },
    },
    file: {
      name: author,
      level: level,
      filename: filename,
      json: false, // we'll generate custom json via the formatter
      formatter: function(options) {
        const data = {};
        data.timestamp = timestamp;
        data.level = options.level;
        data.hostname = os.hostname();
        data.author = author;
        if (options.message) {
          data.message = options.message;
        }
        if (options.meta && Object.keys(options.meta).length) {
          data.meta = options.meta;
        }
        return JSON.stringify(data);
      },
    },
  });
  return winston.loggers.get(author);
};
