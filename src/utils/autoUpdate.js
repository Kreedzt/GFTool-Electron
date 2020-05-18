const log = require('electron-log');
const { promisedReadFile, promisedWriteFile } = require('./promisedFs');
const { getWebPageCommit, getApplicationRelease } = require('./http');
const { updateRepo } = require('../update');
const { getCorrectPath } = require('./env');

const logger = log.scope('autoUpdate.js');

/**
 * Auto check and update web page
 * @return {[Number, Boolean]} [code, isUpdated]: code: check and update res, isUpdated: is success updated
 */
const autoUpdateWebPage = async () => {
  let code = 0;
  let isUpdated = false;
  logger.info('autoUpdateWebPage fn');
  try {
    const currentInfo = JSON.parse(await promisedReadFile(getCorrectPath('src/webVersion.json')));
    logger.info('current web page version', currentInfo);
    const latestInfo = await getWebPageCommit();
    logger.info('latest web page version', latestInfo);
    
    if (currentInfo.oid !== latestInfo.oid) {
      logger.info('new web page detected, updating...');
      const isSuccess = await updateRepo();
      isUpdated = true;
      code = isSuccess ? 0 : -1;

      // when success, write version info to file
      if (isSuccess) {
        await promisedWriteFile(getCorrectPath('src/webVersion.json'), JSON.stringify(latestInfo, null, 2));
        logger.info('write latest web page version info success');
      }
    }
  } catch(e) {
    code = -1;
    logger.error(e);
  }

  return [code, isUpdated];
};

// TODO
const checkApplicationRelease = () => {
  logger.info('checkApplicationRelease fn');
};

module.exports = {
  autoUpdateWebPage,
  checkApplicationRelease
};
