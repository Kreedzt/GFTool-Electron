const log = require('electron-log');
const { promisedReadFile, promisedWriteFile } = require('./promisedFs');

const logger = log.scope('autoUpdate.js');

const autoUpdateWebPage = async () => {
  logger.info('autoUpdateWebPage fn');
  
};

const checkApplicationRelease = () => {
  
};

module.exports = {
  autoUpdateWebPage,
  checkApplicationRelease
}
