const path = require('path');
const log = require('electron-log');
const { promisedExec } = require('./utils/shell');
const { generateCorrectPath } = require('./utils/env');

const repoPath = generateCorrectPath('web');

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
