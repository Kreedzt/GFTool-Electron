const path = require('path');
const { promisedExec } = require('./utils/shell');
const log = require('electron-log');

const repoPath = path.join(__dirname, '../web');

const logger = log.scope('update.js');

const updateRepo = async () => {
  try {
    await promisedExec('which git');
    await promisedExec(`cd ${repoPath}`);
    await promisedExec('git checkout master');
    await promisedExec('git pull');
  } catch (e) {
    logger.error('updateRepo err', e);
  }
};

module.exports = {
  updateRepo
};
