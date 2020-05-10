const path = require('path');
const { promisedExec } = require('./utils/shell');
const log = require('electron-log');

const repoPath = path.join(__dirname, '../web');

const logger = log.scope('update.js');

const execOptions = {
  cwd: repoPath
};

const updateRepo = async () => {
  try {
    await promisedExec('which git', execOptions);
    await promisedExec(`cd ${repoPath}`, execOptions);
    await promisedExec('git checkout master -f', execOptions);
    await promisedExec('git pull', execOptions);
  } catch (e) {
    logger.error('updateRepo err', e);
  }
};

module.exports = {
  updateRepo
};
