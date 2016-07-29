'use strict';
const os = require('os');
const path = require('path');
const fs = require('fs');
const Logger = require('cta-logger');

const filename = os.tmpDir() + path.sep + 'default.txt';
const logger = new Logger({
  filename: filename,
});
logger.info('Starting app...');
logger.log('info', 'Loading dependencies... please wait!');
logger.debug('All dependencies have been loaded.');
logger.error('An error has occurred!');
setTimeout(function() {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('Content of file %s :', filename, data);
  });
}, 500);
