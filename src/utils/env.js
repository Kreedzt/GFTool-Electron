const { app } = require('electron');
const path = require('path');
const log = require('electron-log');
const { promisedReadFile } = require('./promisedFs');
const { isMacOS } = require('./checkOS');

let env = 'development';
let isEnvLocked = false;

const logger = log.scope('env.js');

const setEnv = async () => {
  if (isEnvLocked) return;
  try {
    env = await promisedReadFile(path.join(app.getAppPath(), 'src/envFile'));
    // env = 'development';
    logger.info(`env set to ${env}`);
  } catch (e) {
    logger.error('read env file error', e);
    // env = 'production';
  }
  isEnvLocked = true;
};

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
  setEnv,
  isDevelopment,
  getCorrectPath
};
