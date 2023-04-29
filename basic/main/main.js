import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron';
import './security';
import { join, resolve } from 'node:path';
import database from './database';

let win = null;
let tray = null;

// 禁用硬件加速以节省资源开销
app.disableHardwareAcceleration();
// 限制仅允许运行单个应用
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// 创建新窗口
async function createWindow() {
  win = new BrowserWindow({
    title: 'Steam Original Soundtrack Player',
    width: 1000,
    height: 600,
    frame: false,
    center: true,
    resizable: false,
    transparent: true,
    maximizable: false,
    fullscreenable: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webviewTag: false,
      webSecurity: false, // 播放本地音频需要关闭同源
      preload: join(app.getAppPath(), 'dist/preload.cjs'),
    },
  });

  // 窗口就绪后再显示窗口
  // 防止首屏闪烁
  win.on('ready-to-show', () => {
    win?.show();
    // 开发环境打开开发工具
    // if (import.meta.env.DEV) win?.webContents.openDevTools();
    // 打包测试
    win?.webContents.openDevTools();
  });

  // 加载主窗口页面
  if (import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined)
    await win.loadURL(import.meta.env.VITE_DEV_SERVER_URL);
  else await win.loadFile(resolve(__dirname, '../dist/index.html'));

  // 不要关闭窗口,音乐会断
  win.on('close', e => {
    e.preventDefault();
    win.hide();
  })
}

// 应用就绪后开始创建窗口
app.whenReady().then(() => {
  initMenu();
  createWindow();
}).catch(e => console.error('Failed create window:', e));

app.on('window-all-closed', function () {
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

ipcMain.on('window-close', () => {
  win.hide();
})

// 仅在生产环境执行
if (import.meta.env.PROD) {
  // 尚未发布
  // 应用就绪后检查更新
  // https://www.electron.build/auto-update.html#quick-setup-guide
  // app.whenReady().then(() => import('electron-updater')).then(module => {
  //   const autoUpdater = module.autoUpdater || module.default.autoUpdater;
  //   return autoUpdater.checkForUpdatesAndNotify();
  // }).catch(e => console.error('Failed check and install updates:', e));
}

function initMenu() {
  tray = new Tray(join(join(__dirname, '../other/build'), 'icon.png'));
  // tray = new Tray(join(join(__dirname, import.meta.env.PROD ? '..' : '../other/build'), 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => {
        win.show()
      }
    },
    { type: 'separator' },
    {
      label: '播放',
      click: () => {
        win.webContents.send('player-play')
      }
    },
    {
      label: '暂停',
      click: () => {
        win.webContents.send('player-pause')
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => exitApp()
    },
  ])
  tray.setToolTip('Steam OST Player');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    win.show()
  })
}

function exitApp() {
  win.hide();
  database.close();
  win.webContents.send('player-stop');
  app.quit()
  setTimeout(() => {
    app.exit()
  }, 300);
}