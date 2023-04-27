import { app, BrowserWindow } from 'electron';
import { join, resolve } from 'node:path';

// 创建新窗口
async function createWindow() {
  const browserWindow = new BrowserWindow({
    title: 'Steam Original Soundtrack Player',
    width: 800,
    height: 600,
    frame: false,
    center: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webviewTag: false,
      preload: join(app.getAppPath(), 'dist/preload.cjs'),
    },
  });

  // 窗口就绪后再显示窗口
  // 防止首屏闪烁
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();
    // 开发环境打开开发工具
    if (import.meta.env.DEV) browserWindow?.webContents.openDevTools();
  });

  // 加载主窗口页面
  if (import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined)
    await browserWindow.loadURL(import.meta.env.VITE_DEV_SERVER_URL);
  else await browserWindow.loadFile(resolve(__dirname, '../../../dist/index.html'));

  return browserWindow;
}

// 打开窗口
export async function openWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
