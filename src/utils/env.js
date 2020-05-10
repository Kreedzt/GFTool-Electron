const isDevelopment = process.env.NODE_ENV === 'development';

// Electron-builder will replace our file to *.asar, so must fix path issue here
const generateCorrectPath = path =>
  (isDevelopment ? path : path.replace('resources/app.asar/', ''));

module.exports = {
  isDevelopment,
  generateCorrectPath
};
