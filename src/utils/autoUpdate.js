const log = require('electron-log');
// const { promisedReadFile, promisedWriteFile } = require('./promisedFs');

const logger = log.scope('autoUpdate.js');

// TODO
const autoUpdateWebPage = async () => {
  logger.info('autoUpdateWebPage fn');
};

// TODO
const checkApplicationRelease = () => {
  logger.info('checkApplicationRelease fn');
};

module.exports = {
  autoUpdateWebPage,
  checkApplicationRelease
};
