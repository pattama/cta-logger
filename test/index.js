'use strict';

const Logger = require('../lib');
const os = require('os');
const path = require('path');
const fs = require('fs');

describe('tests', function() {
  it('instanciate with default config', function(done) {
    try {
      const logger = Logger();
      done();
    } catch (e) {
      done(e);
    }
  });
  it('instanciate with invalid config', function(done) {
    try {
      const logger = Logger('abc');
      done('should throw an error');
    } catch (e) {
      console.log(e);
      done();
    }
  });
  it('instanciate with custom config', function(done) {
    try {
      const filename = os.tmpDir() + path.sep + 'default.log';
      const logger = Logger({
        transports: [
          {
            type: 'File',
            options: {
              name: 'default',
              filename: filename,
              level: 'info',
            },
          },
        ],
      });
      logger.info('test');
      setTimeout(function() {
        fs.stat(filename, (err, stats) => {
          if (err) {
            done(err);
          } else if ( !stats.isFile(filename) ) {
            done('file not found');
          } else {
            done();
          }
        });
      }, 500);
    } catch (e) {
      done(e);
    }
  });
});
