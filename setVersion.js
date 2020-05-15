const fs = require('fs');
const path = require('path');
const { getWebPageCommit, getApplicationRelease } = require('./src/utils/http');
const { encode } = require('./src/utils/promisedFs');

const initializeEnv = async () => {
  const commitInfo = await getWebPageCommit();

  if (commitInfo) {
    fs.writeFileSync(
      path.join(__dirname, './src/webVersion'),
      JSON.stringify(commitInfo, null, 2),
      encode
    );
  }

  const releaseInfo = await getApplicationRelease();

  if (releaseInfo) {
    fs.writeFileSync(
      path.join(__dirname, './src/releaseVersion'),
      JSON.stringify(commitInfo, null, 2),
      encode
    );
  }
};

initializeEnv();
