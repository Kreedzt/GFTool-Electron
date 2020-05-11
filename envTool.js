const fs = require('fs');
const path = require('path');

const params = process.argv;

console.log('params', params[2]);

const mode = params[2];

fs.writeFile(path.join(__dirname, './src/envFile'), mode, 'utf8', (err, content) => {
  if (err) {
    console.error(err);
  } else {
    console.log(content);
  }
});
