const audio = new Audio();

export function start(path) {
    audio.src = path;
    audio.load();
    audio.play();
}

export function stop() {
    audio.pause();
}

// import { ipcRenderer } from 'electron';

// export function play(path) {
//     return ipcRenderer.send('player-play', path);
// }

// export function pause() {
//     return ipcRenderer.send('player-pause');
// }

// export function stop() {
//     return ipcRenderer.send('player-stop');
// }