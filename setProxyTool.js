const fs = require('fs');
const path = require('path');
const { promisedAccessFile, promisedMkdir } = require('./src/utils/promisedFs');

const params = process.argv;

console.log('params', params[2]);

const mode = params[2];

(async () => {
  try {
    await promisedAccessFile(path.join(__dirname, 'config/'));
  } catch (e) {
    await promisedMkdir(path.join(__dirname, 'config'));
  }

  fs.writeFileSync(path.join(__dirname, './config/proxy'), mode, 'utf8');
})();
