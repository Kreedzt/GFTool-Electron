const { app } = require('electron');
const path = require('path');
const log = require('electron-log');
const { promisedExistFile } = require('./promisedFs');
const { isMacOS } = require('./checkOS');

let env = 'development';

const logger = log.scope('env.js');

(async () => {
  try {
    await promisedExistFile('app.asar');
    env = 'production';
  } catch (e) {
    env = 'development';
  }
})();

const isDevelopment = env === 'development';

const getCorrectPath = (targetPath) => {
  logger.info('targetPath:', targetPath);
  logger.info('App Path:', app.getAppPath());
  let returnPath = '';
  if (isDevelopment) {
    returnPath = path.join(app.getAppPath(), targetPath);
  } else if (isMacOS()) {
    logger.info('system: macos');
    returnPath = path.join(app.getAppPath(), '../../', targetPath);
  } else {
    returnPath = path.join(app.getAppPath(), '../', targetPath);
  }
  logger.info('returnPath:', returnPath);
  return returnPath;
};


module.exports = {
  isDevelopment,
  getCorrectPath
};
