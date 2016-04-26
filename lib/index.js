'use strict';

const winston = require('winston');
const os = require('os');
const util = require('util');
const path = require('path');

function formatter(params) {
  const author = params.author.toUpperCase();
  return function(options) {
    const data = [];
    data.push(params.timestamp);
    const level = params.colorize ? winston.config.colorize(options.level, options.level) : options.level;
    data.push(level);
    data.push(os.hostname());
    data.push(author);
    if (options.message !== undefined) {
      data.push(util.inspect(options.message, false, 5, false));
    }
    if (options.meta && Object.keys(options.meta).length) {
      data.push(util.inspect(options.meta, false, 5, false));
    }
    return data.join(' - ');
  };
}
 /**
 * logger module
 * @param {object} config - configuration object
 * @param {string} config.author - author of the log to output: brick/module/component name
 * @param {string} config.level - log level: error, warn, info, verbose, debug, silly
 * @param {string} config.filename - log filename
 * @return {object} - logger instance
 * */
exports = module.exports = function(config) {
  const timestamp = new Date().toISOString();
  const author = config && config.author || 'unknown';
  const level = config && config.level || 'silly';
  const filename = config && config.filename || os.tmpDir() + path.sep + 'cta-default-logger-' + Date.now() + '.log';
  winston.loggers.add(author, {
    console: {
      level: level,
      formatter: formatter({
        timestamp: timestamp,
        author: author,
        colorize: true,
      }),
    },
    file: {
      name: author,
      level: level,
      filename: filename,
      json: false,
      formatter: formatter({
        timestamp: timestamp,
        author: author,
        colorize: false,
      }),
    },
  });
  return winston.loggers.get(author);
};
