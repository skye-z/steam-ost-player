import { ipcMain } from 'electron';
const audio = new Audio();

let isStop = true;

ipcMain.on('player-play', (_event, ...args) => {
    console.log('play')
    let path = args[0];
    audio.src = path;
    if (isStop) {
        audio.load();
        isStop = false;
    }
    audio.play();
});

ipcMain.on('player-pause', () => {
    console.log('pause')
    audio.pause();
});

ipcMain.on('player-stop', () => {
    console.log('stop')
    isStop = true;
});