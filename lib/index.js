'use strict';

const winston = require('winston');
const tools = require('cta-tools');
const os = require('os');
const path = require('path');
const _ = require('lodash');

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
   if (typeof config === 'string') {
     config = { author: config };
   }
   const result = tools.validate(config, {
     author: {optional: true, type: 'string', defaultTo: 'UNKNOWN'},
     level: {optional: true, type: 'string', defaultTo: 'debug'},
     console: {optional: true, type: 'boolean', defaultTo: true},
     file: {optional: true, type: 'boolean', defaultTo: true},
     filename: {optional: true, type: 'string', defaultTo: os.tmpDir() + path.sep + 'cta-default-logger.log'},
   }, {throwErr: false});

   this.conf = result.output;
   this.conf.author = this.conf.author.toUpperCase();

   if (winston.loggers.has(this.conf.author)) {
     winston.loggers.close(this.conf.author);
   }

   this.transports = {};

   const that = this;
   // console transport?
   if (this.conf.console) {
     this.transports.console = {
       level: this.conf.level,
       formatter: function (options) {
         const data = [];
         data.push(new Date().toISOString());
         data.push(winston.config.colorize(options.level, options.level));
         data.push(os.hostname());
         data.push(that.conf.author);
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
   if (this.conf.file) {
     this.transports.file = {
       name: 'file',
       level: this.conf.level,
       filename: this.conf.filename,
       json: false, // we'll generate custom json via the formatter
       formatter: function (options) {
         const data = {};
         data.timestamp = new Date().toISOString();
         data.level = options.level;
         data.hostname = os.hostname();
         data.author = that.conf.author;
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
   winston.loggers.add(this.conf.author, this.transports);
   const logger = winston.loggers.get(this.conf.author);
   // Fix https://github.com/winstonjs/winston/issues/175
   if (!this.conf.console) {
     logger.remove(winston.transports.Console);
   }
   return _.create(logger, this);
 }
}

function _construct(constr, args) {
  return new (Function.prototype.bind.apply(constr, [null].concat(args)));
}

exports = module.exports = function LoggerFn() {
  return _construct(Logger.prototype.constructor, Array.prototype.slice.call(arguments));
};
