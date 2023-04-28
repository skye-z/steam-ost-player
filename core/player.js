import { ipcRenderer } from 'electron';
const audio = new Audio();
let isStop = true;
let playList = [];
let playMap = {};
let index = 0;

// 事件 播放完毕
audio.onended = () => {
    if (index == playList.length - 1) index = 0
    else index++;
    playMusic(playList[index])
    console.log('[Player] Play next song')
}

// 导出函数 加载播单
export function load(data) {
    playList = [];
    playMap = data;
    for (let code in data) {
        playList.push(code);
    }
}

// 导出函数 开始播放
export function play(code) {
    playMusic(code)
}

// 导出函数 恢复播放
export function pause() {
    audio.pause();
    isStop = true;
}

// 导出函数 停止播放
export function stop() {
    audio.pause();
    isStop = true;
}

// 监听主线程 开始播放
ipcRenderer.on('player-play', () => {
    if (isStop) {
        audio.load();
        isStop = false;
    } else console.log('[Player] Resume playback')
    audio.play();
});

// 监听主线程 恢复播放
ipcRenderer.on('player-pause', () => {
    audio.pause();
    console.log('[Player] Pause playback')
});

// 监听主线程 停止播放
ipcRenderer.on('player-stop', () => {
    audio.pause();
    isStop = true;
    console.log('[Player] Stop playback')
});

// 播放音乐
function playMusic(code) {
    let item = playMap[code];
    if (item) {
        let music = undefined;
        for (let i in item.containers) {
            if (item.containers[i].lossless) {
                music = item.containers[i]
                break;
            }
        }
        if (music == undefined) music = item.containers[0]
        console.log('[Player] Start playing: ' + item.name)
        index = playList.indexOf(code);
        audio.src = music.path;
        if (isStop) {
            audio.load();
            isStop = false;
        }
        audio.play();
    }
}