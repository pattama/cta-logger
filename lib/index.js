'use strict';

const winston = require('winston');
const tools = require('cta-tools');
const os = require('os');
const path = require('path');

 /**
 * logger module
 * @param {object} config - configuration object
 * @param {string} config.author - author of the log to output (basically name of brick/module/component...), default to UNKNOWN
 * @param {string} config.level - log level (error, warn, info, verbose, debug, silly), default to debug
 * @param {boolean} config.console - weather to log to console or not, default to true
 * @param {boolean} config.file - weather to log to file or not, default to true
 * @param {string} config.filename - full path to log file name for json output
 * @param {object} dependencies
 * @return {object} - logger instance
 * */

class Logger {
 constructor(config, dependencies) {
   this.dependencies = dependencies || {};
   const result = tools.validate(config, {
     author: {optional: true, type: 'string', defaultTo: 'UNKNOWN'},
     level: {optional: true, type: 'string', defaultTo: 'debug'},
     console: {optional: true, type: 'boolean', defaultTo: true},
     file: {optional: true, type: 'boolean', defaultTo: true},
     filename: {optional: true, type: 'string', defaultTo: os.tmpDir() + path.sep + 'cta-default-logger.log'},
   }, {throwErr: false});

   const conf = result.output;
   conf.author = conf.author.toUpperCase();

   if (winston.loggers.has(conf.author)) {
     winston.loggers.close(conf.author);
   }

   const transports = {};

   // console transport?
   if (conf.console) {
     transports.console = {
       level: conf.level,
       formatter: function (options) {
         const data = [];
         data.push(new Date().toISOString());
         data.push(winston.config.colorize(options.level, options.level));
         data.push(os.hostname());
         data.push(conf.author);
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
   if (conf.file) {
     transports.file = {
       name: 'file',
       level: conf.level,
       filename: conf.filename,
       json: false, // we'll generate custom json via the formatter
       formatter: function (options) {
         const data = {};
         data.timestamp = new Date().toISOString();
         data.level = options.level;
         data.hostname = os.hostname();
         data.author = conf.author;
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
   winston.loggers.add(conf.author, transports);
   const logger = winston.loggers.get(conf.author);
   // Fix https://github.com/winstonjs/winston/issues/175
   if (!conf.console) {
     logger.remove(winston.transports.Console);
   }
   return logger;
 }
}

exports = module.exports = Logger;
