'use strict';

const winston = require('winston');
const os = require('os');
const util = require('util');

function formatter(params) {
  return function(options) {
    const data = [];
    data.push(params.timestamp);
    const level = params.colorize ? winston.config.colorize(options.level, options.level) : options.level;
    data.push(level);
    data.push(params.author);
    data.push(os.hostname());
    if (options.message !== undefined) {
      data.push(util.inspect(options.message, false, 5, params.colorize));
    }
    if (options.meta && Object.keys(options.meta).length) {
      data.push(util.inspect(options.meta, false, 5, params.colorize));
    }
    return data.join(' - ');
  };
}

exports = module.exports = function(config) {
  const timestamp = new Date().toISOString();
  if (winston.loggers.has(config.author)) {
    winston.loggers.close(config.author);
  }
  winston.loggers.add(config.author, {
    console: {
      level: config.level,
      formatter: formatter({
        timestamp: timestamp,
        author: config.author,
        colorize: true,
      }),
    },
    file: {
      name: Date.now(),
      level: config.level,
      filename: config.filename,
      json: false,
      formatter: formatter({
        timestamp: timestamp,
        author: config.author,
        colorize: false,
      }),
    },
  });
  return winston.loggers.get(config.author);
};
