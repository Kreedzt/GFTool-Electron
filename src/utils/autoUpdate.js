const { shell, dialog } = require('electron');
const log = require('electron-log');
const { promisedReadFile, promisedWriteFile } = require('./promisedFs');
const { getWebPageCommit, getApplicationRelease } = require('./http');
const { updateRepo } = require('../update');
const { getCorrectPath } = require('./env');

const logger = log.scope('autoUpdate.js');

/**
 * Auto check and update web page
 * @return {[Number, Boolean]}
 * [code, isUpdated]: code: check and update res, isUpdated: is success updated
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

    if (!latestInfo) {
      logger.error('get latest web page version error');
    }
    if (latestInfo && currentInfo.oid !== latestInfo.oid) {
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
  } catch (e) {
    code = -1;
    logger.error(e);
  }

  return [code, isUpdated];
};

/**
 * Auto check Application release and go to download page
 */
const checkApplicationRelease = async () => {
  logger.info('checkApplicationRelease fn');

  try {
    const currentInfo = JSON.parse(await promisedReadFile(getCorrectPath('src/releaseVersion.json')));
    logger.info('current release version', currentInfo);
    const latestInfo = await getApplicationRelease();
    logger.info('latest application release version', latestInfo);

    if (!latestInfo) {
      logger.error('get latest application release version error');
    }

    if (latestInfo && currentInfo.tagName !== latestInfo.tagName) {
      logger.info('new application release detected');

      dialog.showMessageBox({
        type: 'info',
        detail: 'New application release detected, go to download now?',
        buttons: ['Confirm', 'Cancel']
      }).then(res => {
        logger.info(res);

        // Clicked 'Confirm'
        if (res.response === 0) {
          shell.openExternal(
            'https://github.com/Kreedzt/GFTool-Electron/releases'
          );
        }
      });
    }
  } catch (e) {
    logger.error(e);
  }
};

module.exports = {
  autoUpdateWebPage,
  checkApplicationRelease
};
