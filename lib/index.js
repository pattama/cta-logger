'use strict';

const winston = require('winston');
const os = require('os');
const util = require('util');
const path = require('path');

function formatter(params) {
  return function(options) {
    const data = [];
    data.push(params.timestamp);
    const level = params.colorize ? winston.config.colorize(options.level, options.level) : options.level;
    data.push(level);
    data.push(params.author);
    data.push(os.hostname());
    if (options.message !== undefined) {
      data.push(util.inspect(options.message, false, 5, false));
    }
    if (options.meta && Object.keys(options.meta).length) {
      data.push(util.inspect(options.meta, false, 5, false));
    }
    return data.join(' - ');
  };
}

exports = module.exports = function(config) {
  const timestamp = new Date().toISOString();
  const author = config && config.author || 'unknown';
  const level = config && config.level || 'silly';
  const filename = config && config.filename || os.tmpDir() + path.sep + 'cta-default-logger-' + Date.now() + '.log';
  if (winston.loggers.has(author)) {
    winston.loggers.close(author);
  }
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
      name: Date.now(),
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
