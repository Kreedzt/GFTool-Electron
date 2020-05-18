const fs = require('fs');
const path = require('path');
const { getWebPageCommit, getApplicationRelease } = require('./src/utils/http');
const {
  encode,
  promisedMkdir,
  promisedAccessFile,
  promisedWriteFile,
} = require('./src/utils/promisedFs');

const initializeEnv = async () => {
  const commitInfo = await getWebPageCommit();

  try {
    await promisedAccessFile(path.join(__dirname, 'config/'));
  } catch (e) {
    await promisedMkdir(path.join(__dirname, 'config'));
  }

  fs.writeFileSync(
    path.join(__dirname, './config/webVersion.json'),
    JSON.stringify(commitInfo || {}, null, 2),
    encode
  );

  const releaseInfo = await getApplicationRelease();

  fs.writeFileSync(
    path.join(__dirname, './config/releaseVersion.json'),
    JSON.stringify(releaseInfo || {}, null, 2),
    encode
  );

  try {
    await promisedAccessFile(path.join(__dirname, 'config/proxy'));
  } catch (e) {
    await promisedWriteFile(path.join(__dirname, 'config/proxy'), '');
  }
};

initializeEnv();
