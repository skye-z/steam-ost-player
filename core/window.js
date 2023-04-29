import { ipcRenderer } from 'electron';

export function close() {
    ipcRenderer.send('window-close');
}