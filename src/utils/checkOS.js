const log = require('electron-log');

const logger = log.scope('checkOS.js');

logger.info('platform:', process.platform);

const isMacOS = () => process.platform === 'darwin';

module.exports = {
  isMacOS
};
