const { promisedReadFile, promisedWriteFile } = require('./promisedFs');
const { getCorrectPath } = require('./env');

const proxyFilePath = getCorrectPath('src/proxy');

const setProxy = async proxyUrl => promisedWriteFile(proxyFilePath, proxyUrl);

const getProxy = async () => promisedReadFile(proxyFilePath);

module.exports = {
  setProxy,
  getProxy
};
