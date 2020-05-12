const path = require('path');
const log = require('electron-log');
const { promisedExec } = require('./utils/shell');
const { getCorrectPath, setEnv } = require('./utils/env');

const logger = log.scope('update.js');

const updateRepo = async () => {
  await setEnv();
  const repoPath = getCorrectPath('web');

  const execOptions = {
    cwd: repoPath,
  };
  
  logger.info('repoPath', repoPath);
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
  updateRepo,
};
