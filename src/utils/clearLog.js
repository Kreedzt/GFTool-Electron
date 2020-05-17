const log = require('electron-log');
const { promisedWriteFile } = require('./promisedFs');

const logFilePath = log.transports.file.getFile().path;

const logger = log.scope('clearLog.js');

const clearLog = async () => {
  logger.info('clearLog fn');
  return promisedWriteFile(logFilePath, '');
};

module.exports = {
  clearLog
};
