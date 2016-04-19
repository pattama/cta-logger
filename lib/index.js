'use strict';

const winston = require('winston');

module.exports = function(config) {
  let pConfig;
  if (config) {
    if (typeof config === 'object' && 'transports' in config && Array.isArray(config.transports)) {
      pConfig = {
        transports: [],
      };
      config.transports.forEach(function(transport) {
        if (typeof transport === 'object' && 'type' in transport && 'options' in transport && typeof transport.type === 'string' && typeof transport.options === 'object') {
          const obj = new (winston.transports[transport.type])(transport.options);
          pConfig.transports.push(obj);
        }
      });
    } else {
      throw new Error('cta-logger -> invalid config');
    }
  }
  return new winston.Logger(pConfig);
};
