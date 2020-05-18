const { BrowserWindow, ipcMain } = require('electron');
const log = require('electron-log');
const { getCorrectPath } = require('./utils/env');
const { getProxy, setProxy } = require('./utils/proxy');

const logger = log.scope('proxyConfig.js');

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
        nodeIntegration: true,
      },
    });

    proxyWindow.loadFile(getCorrectPath('src/proxyWebConfig.html', './'));

    proxyWindow.on('closed', () => {
      proxyWindow = null;
    });

    proxyWindow.once('ready-to-show', () => {
      proxyWindow.show();
    });
  }
};

ipcMain.on('getProxy', async (event, callback) => {
  logger.info('ipcMain getProxy listener', event, callback);

  try {
    const proxy = await getProxy();
    logger.info('ipcMain getProxy res', proxy);

    event.reply('getProxy-success', proxy);
  } catch (e) {
    logger.error('ipcMain getProxy error', e);
    event.reply('getProxy-error', e);
  }
});

ipcMain.on('setProxy', async (event, url) => {
  logger.info('ipcMain setProxy listener', event, url);

  try {
    await setProxy(url);
    logger.info('ipcMain setProxy success', url);
    event.reply('setProxy-success');
  } catch (e) {
    logger.error('ipcMain setProxy error', e);
    event.reply('setProxy-error', e);
  }
});

module.exports = {
  initializeWindow,
};
