const log = require('electron-log');
const { promisedReadFile, promisedWriteFile } = require('./promisedFs');
const { getCorrectPath } = require('./env');

const logger = log.scope('proxy.js');

const proxyFilePath = getCorrectPath('config/proxy');

const setProxy = async proxyUrl => {
  logger.info('setProxy fn');
  logger.info('proxyFilePath', proxyFilePath);
  logger.info('proxyUrl', proxyUrl);

  return promisedWriteFile(proxyFilePath, proxyUrl);
};

const getProxy = async () => {
  logger.info('getProxy fn');
  logger.info('proxyFilePath', proxyFilePath);

  return promisedReadFile(proxyFilePath);
};

module.exports = {
  setProxy,
  getProxy,
};
