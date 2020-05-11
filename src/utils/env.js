const { app } = require('electron');
const path = require('path');
const isDevelopment = process.env.NODE_ENV === 'development';

// Electron-builder will replace our file to *.asar, so must fix path issue here
const generateCorrectPath = targetPath => path.join(app.getAppPath(), targetPath);

module.exports = {
  isDevelopment,
  generateCorrectPath
};
