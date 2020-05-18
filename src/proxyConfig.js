const {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  dialog,
  shell,
  clipboard
} = require('electron');
const log = require('electron-log');
const { getCorrectPath } = require('./utils/env');

let proxyWindow = null;

const initializeWindow = () => {
  if (proxyWindow) {
    proxyWindow.focus();
  } else {
    proxyWindow = new BrowserWindow({
      width: 800,
      height: 200,
      backgroundColor: '#fff',
      webPreferences: {
        nodeIntegration: true
      }
    });

    proxyWindow.loadFile(getCorrectPath('src/proxyWebConfig.html', './'));

    proxyWindow.on('closed', () => {
      proxyWindow = null;
    });

    proxyWindow.once('ready-to-show', () => {
      proxyWindow.show();
    }); 
  }
}

module.exports = {
  initializeWindow
};
