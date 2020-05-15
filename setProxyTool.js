const fs = require('fs');
const path = require('path');

const params = process.argv;

console.log('params', params[2]);

const mode = params[2];

fs.writeFileSync(path.join(__dirname, './src/proxy'), mode, 'utf8');
