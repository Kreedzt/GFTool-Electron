const { exec } = require('child_process');
const log = require('electron-log');

const logger = log.scope('shell.js');

const promisedExec = str =>
  new Promise((resolve, reject) => {
    exec(str, (err, stdout, stderr) => {
      if (err) {
        logger.error('exec nodejs err', err);
        reject(err);
      } else if (stderr) {
        logger.error('exec shell stderr', stderr);
        reject(err);
      } else {
        logger.info('exec res', stdout);
        resolve(stdout);
      }
    });
  });

module.exports = {
  promisedExec
};
