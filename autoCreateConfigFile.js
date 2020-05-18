const log = require('electron-log');
const path = require('path');
const {
  promisedAccessFile,
  promisedMkdir,
  promisedWriteFile,
} = require('./src/utils/promisedFs');

const logger = log.scope('autoCreateConfigFolder.js');

const autoCreateConfigFile = async () => {
  try {
    await promisedAccessFile(path.join(__dirname, 'config/'));
  } catch (e) {
    logger.error("can't access config folder, creating...");
    await promisedMkdir(path.join(__dirname, 'config'));
    await Promise.all([
      promisedWriteFile(path.join(__dirname, 'config/proxy'), ''),
      promisedWriteFile(path.join(__dirname, 'config/webVersion.json'), '{}'),
      promisedWriteFile(
        path.join(__dirname, 'config/releaseVersion.json'),
        '{}'
      ),
    ]);
    logger.info('create config folder success');
  }
};

autoCreateConfigFile();
