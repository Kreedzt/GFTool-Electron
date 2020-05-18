const log = require('electron-log');
const {
  promisedAccessFile,
  promisedMkdir,
  promisedWriteFile,
} = require('./promisedFs');
const { getCorrectPath } = require('./env');

const logger = log.scope('autoCreateConfigFolder.js');

const autoCreateConfigFile = async () => {
  try {
    await promisedAccessFile(getCorrectPath('config/'));
  } catch (e) {
    logger.error("can't access config folder, creating...");
    await promisedMkdir(getCorrectPath('config'));
    await Promise.all([
      promisedWriteFile(getCorrectPath('config/proxy'), ''),
      promisedWriteFile(getCorrectPath('config/webVersion.json'), '{}'),
      promisedWriteFile(getCorrectPath('config/releaseVersion.json'), '{}'),
    ]);
    logger.info('create config folder success');
  }
};

module.exports = {
  autoCreateConfigFile,
};
