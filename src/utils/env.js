const { app } = require('electron');
const path = require('path');
const log = require('electron-log');
const { isMacOS } = require('./checkOS');

const logger = log.scope('env.js');

const isDevelopment = () => !app.isPackaged;

const getCorrectPath = (targetPath, customLevelPath) => {
  logger.info('targetPath:', targetPath);
  let returnPath = '';

  // judgement if env is not electron runtime
  if (!app) {
    return targetPath;
  }

  logger.info('App Path:', app.getAppPath());
  logger.info('isProduction Env:', app.isPackaged);

  if (isDevelopment()) {
    returnPath = path.join(app.getAppPath(), targetPath);
  } else if (isMacOS()) {
    logger.info('system: macos');
    returnPath = path.join(app.getAppPath(), customLevelPath || '../../', targetPath);
  } else {
    returnPath = path.join(app.getAppPath(), customLevelPath || '../../', targetPath);
  }
  logger.info('returnPath:', returnPath);
  return returnPath;
};

module.exports = {
  isDevelopment,
  getCorrectPath,
};
