import {app} from 'electron';
import './security-restrictions';
import {openWindow} from '/@/mainWindow';
import {platform} from 'node:process';
import database from './database';

// 限制仅允许运行单个应用
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
// 事件 -> 尝试启动第二个应用
app.on('second-instance', openWindow);
// 禁用硬件加速以节省资源开销
app.disableHardwareAcceleration();

// 事件 -> 窗口全部关闭
app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    database.close();
    app.quit();
  }
});

// 事件 -> 尝试激活应用
app.on('activate', openWindow);

// 应用就绪后开始创建窗口
app.whenReady().then(openWindow).catch(e => console.error('Failed create window:', e));

// 仅在生产环境执行
if (import.meta.env.PROD) {
  // 应用就绪后检查更新
  // https://www.electron.build/auto-update.html#quick-setup-guide
  app.whenReady().then(() => import('electron-updater')).then(module => {
      const autoUpdater = module.autoUpdater || module.default.autoUpdater;
      return autoUpdater.checkForUpdatesAndNotify();
    }).catch(e => console.error('Failed check and install updates:', e));
}