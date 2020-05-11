const path = require('path');
const log = require('electron-log');
const { promisedExec } = require('./utils/shell');
const { getCorrectPath } = require('./utils/env');

const repoPath = getCorrectPath('web');

const logger = log.scope('update.js');

const execOptions = {
  cwd: repoPath
};

const updateRepo = async () => {
  try {
    await promisedExec('which git', execOptions);
    await promisedExec(`cd ${repoPath}`, execOptions);
    await promisedExec('git reset master --hard', execOptions);
    await promisedExec('git pull', execOptions);
  } catch (e) {
    logger.error('updateRepo err', e);
  }
};

module.exports = {
  updateRepo
};
