const { app, BrowserWindow, Menu, MenuItem, dialog } = require('electron');
const path = require('path');
const log = require('electron-log');
const { testReq } = require('./utils/http');
const { isMacOS } = require('./utils/checkOS');
const { updateRepo } = require('./update');
const { generateCorrectPath } = require('./utils/env');

let mainWindow = null;

const targetPATH = generateCorrectPath('/web/pages/index.html');

const logger = log.scope('index.js');

const menuTemplate = [
  {
    label: 'Test',
    submenu: [
      {
        label: 'Test GitHub Request(Crashed, repairing...)',
        enabled: false,
        accelerator: 'CmdOrCtrl+L',
        click: () => {
          logger.info('Triggered click');
          testReq();
        },
      },
    ],
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
        },
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
        },
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
        },
      },
    ],
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
              detail: 'update page success',
            });
          }
        },
      },
    ],
  },
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
      nodeIntegration: false,
    },
    backgroundColor: '#fff',
  });

  mainWindow.loadFile(targetPATH);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

function initialize() {
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
  win: mainWindow,
};
