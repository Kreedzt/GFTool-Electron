const { app } = require('electron');
const path = require('path');
const log = require('electron-log');
const { promisedReadFile } = require('./promisedFs');
const { isMacOS } = require('./checkOS');

class EnvUtil {
  static env = 'development';

  static isEnvLocked = false;
}

const logger = log.scope('env.js');

const setEnv = async () => {
  if (EnvUtil.isEnvLocked) return;
  try {
    EnvUtil.env = await promisedReadFile(
      path.join(app.getAppPath(), 'src/envFile')
    );
    // env = 'development';
    logger.info(`env set to ${EnvUtil.env}`);
  } catch (e) {
    logger.error('read env file error', e);
    // env = 'production';
  }
  EnvUtil.isEnvLocked = true;
};

const isDevelopment = () => EnvUtil.env === 'development';

const getCorrectPath = targetPath => {
  logger.info('targetPath:', targetPath);
  logger.info('App Path:', app.getAppPath());
  logger.info('current Env:', EnvUtil.env);
  let returnPath = '';
  if (isDevelopment()) {
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
  getCorrectPath,
};
