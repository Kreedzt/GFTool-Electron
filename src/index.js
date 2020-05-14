require('v8-compile-cache');
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
const { getCorrectPath, setEnv } = require('./utils/env');
const { testReq } = require('./utils/http');
const { isMacOS } = require('./utils/checkOS');
const { updateRepo } = require('./update');

let mainWindow = null;

const logger = log.scope('index.js');

const menuTemplate = [
  {
    label: 'Test',
    submenu: [
      {
        label: 'Test GitHub Request(Crashed, repairing...)',
        // enabled: false,
        accelerator: 'CmdOrCtrl+L',
        click: () => {
          logger.info('Triggered click');
          testReq();
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'SelectAll',
        accelerator: 'CmdOrCtrl+A',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.selectAll();
            logger.info(
              'SelectAll: window contents',
              focusedWindow.webContents
            );
          }
        }
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.cut();
            logger.info('Cut: window contents', focusedWindow.webContents);
          }
        }
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.copy();
            logger.info('Copy: window contents', focusedWindow.webContents);
          }
        }
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.paste();
            logger.info('Paste: window contents', focusedWindow.webContents);
          }
        }
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            // on reload, start fresh and close any old
            // open secondary windows
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach(win => {
                if (win.id > 1) win.close();
              });
            }
            focusedWindow.reload();
          }
        }
      },
      {
        label: 'Toggle Full Screen',
        accelerator: (() => {
          if (isMacOS()) {
            return 'Ctrl+Command+F';
          }
          return 'F11';
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (() => {
          if (isMacOS()) {
            return 'Alt+Command+I';
          }
          return 'Ctrl+Shift+I';
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        }
      }
    ]
  },
  {
    label: 'Actions',
    submenu: [
      {
        label: 'Copy url path',
        click: (item, focusedWindow) => {
          logger.info('Copy url path');
          if (focusedWindow) {
            const url = focusedWindow.webContents.getURL();
            clipboard.writeText(url);
            dialog.showMessageBox({
              type: 'info',
              title: 'Copy url path',
              detail: 'Copy url success! Now you can paste anywhere you want'
            });
          }
        }
      },
      {
        label: 'Open current link external',
        click: (item, focusedWindow) => {
          logger.info('Open current link');
          if (focusedWindow) {
            const url = focusedWindow.webContents.getURL();
            shell.openExternal(url);
          }
        }
      }
    ]
  },
  {
    label: 'About',
    submenu: [
      {
        label: 'Manual update page',
        click: async () => {
          logger.info('manual updating...');
          await updateRepo();
          if (mainWindow) {
            mainWindow.reload();
            dialog.showMessageBox({
              type: 'info',
              title: 'update page',
              detail: 'update page success'
            });
          }
        }
      },
      {
        label: 'Open Logs file',
        click: () => {
          const logFilePath = log.transports.file.getFile().path;
          logger.info('log file path:', logFilePath);
          shell.openExternal(`file://${logFilePath}`);
        }
      },
      {
        label: 'Download latest software',
        click: () => {
          shell.openExternal(
            'https://github.com/Kreedzt/GFTool-Electron/releases'
          );
        }
      },
      {
        label: 'Go to web page',
        click: () => {
          shell.openExternal('https://hycdes.com/');
        }
      },
      {
        label: `Current Version: ${app.getVersion()}`,
        enabled: false
      }
    ]
  }
];

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
  if (process.mas) return;

  app.requestSingleInstanceLock();

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function createWindow() {
  const targetPath = getCorrectPath('web/pages/index.html');
  if (isMacOS()) {
    const dockMenu = Menu.buildFromTemplate(menuTemplate);
    app.dock.setMenu(dockMenu);
  } else {
    const menu = new Menu();
    menuTemplate.forEach(menuConfig => {
      menu.append(new MenuItem(menuConfig));
    });
  }

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false
    },
    backgroundColor: '#fff'
  });

  mainWindow.loadFile(targetPath);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

async function initialize() {
  await setEnv();
  makeSingleInstance();

  app.whenReady().then(() => {
    createWindow();
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
  });
}

app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (!isMacOS()) {
    app.quit();
  }
});

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

initialize();

module.exports = {
  win: mainWindow
};
