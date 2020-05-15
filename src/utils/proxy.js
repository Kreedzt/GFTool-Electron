const fs = require('fs');
const { promisedReadFile, promisedWriteFile } = require('./promisedFs');
const { getCorrectPath } = require('./env');

const proxyFilePath = getCorrectPath('proxy');

const setProxy = async (proxyUrl) => {
  return promisedWriteFile(proxyFilePath, proxyUrl);
};

const getProxy = async () => {
  return promisedReadFile(proxyFilePath);
};

module.exports = {
  setProxy,
  getProxy
}
