const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

const targetPATH = `file://${path.join(__dirname, '../public/pages/index.html')}`;

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false
    },
    backgroundColor: '#fff'
  });

  win.loadURL(targetPATH);

  win.on('closed', () => {
    win = null;
  });

  win.once('ready-to-show', () => {
    win.show();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
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

module.exports = {
  win
}
