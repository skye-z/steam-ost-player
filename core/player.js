import { ipcRenderer } from 'electron';
const audio = new Audio();
let playList = [];
let playMap = {};
let index = 0;

// 事件 播放完毕
audio.onended = () => playNext()

// 导出函数
export const player = {
    load(data) {
        playList = [];
        playMap = data;
        for (let code in data) {
            playList.push(code);
        }
    },
    play(code) {
        playMusic(code)
    },
    pause() {
        audio.pause();
        sendEvent('pause');
    },
    next() {
        playNext();
    },
    last() {
        playLast();
    },
    getNow() {
        let code = playList[index]
        if (code) return playMap[code];
        else return undefined;
    },
    getStatus() {
        return {
            currentTime: audio.currentTime,
            muted: audio.muted,
            volume: audio.volume,
            playbackRate: audio.playbackRate
        }
    }
}

// 监听主线程 开始播放
ipcRenderer.on('player-play', () => {
    let code = playList[index];
    if (code) {
        playMusic(code);
        sendEvent('play', playMap[code]);
    }
});

// 监听主线程 恢复播放
ipcRenderer.on('player-pause', () => {
    audio.pause();
    sendEvent('pause');
    console.log('[Player] Pause playback')
});

// 播放音乐
function playMusic(code) {
    if (code == undefined) code = playList[index];
    let item = playMap[code];
    if (item) {
        if (!audio.src || playList.indexOf(code) != index) {
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
            sendEvent('play', item);
            audio.src = music.path;
            audio.load();
        } else sendEvent('restore', item);
        audio.play();
    } else sendEvent('error')
}

function playNext() {
    playMusic(playList[index == playList.length - 1 ? 0:index+1])
    console.log('[Player] Play next music')
}

function playLast() {
    if (index == 0) return false;
    playMusic(playList[index - 1])
    console.log('[Player] Play last music')
}

function sendEvent(action, data) {
    const event = new CustomEvent("player-event", { detail: { action, data } })
    document.dispatchEvent(event)
}