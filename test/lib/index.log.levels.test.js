'use strict';

const o = require('../common');

describe('log levels', () => {
  o.levels.forEach((level) => { // error, warn, info, verbose, debug, silly
    it(`should output log level "${level}" and lower only`, (done) => {
      const logFile = o.os.tmpDir() + o.path.sep + 'cta-logger-' + level;
      const logger = new o.Lib(null, {
        name: 'logger',
        properties: {
          level: level,
          console: true,
          file: true,
          filename: logFile,
        },
      });
      const content = [];
      o.levels.forEach((lev) => {
        const text = `${level} ${lev} ${o.shortid.generate()}`;
        content.push(text);
        logger.log(lev, text);
      });
      setTimeout(() => {
        const data = o.fs.readFileSync(logFile).toString();
        // console.log('data for level ' + level, data);
        o.fs.unlinkSync(logFile);
        for (let i = 0; i < o.levels.length; i++) {
          const lev = o.levels[i];
          const text = content[i];
          if (o.levels.indexOf(level) >= o.levels.indexOf(lev)) {
            o.assert.isOk(data.indexOf(text) > -1);
          } else {
            o.assert.isOk(data.indexOf(text) === -1);
          }
        }
        done();
      }, 100);
    });
  });
});
