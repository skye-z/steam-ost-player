import { ipcRenderer } from 'electron';
const audio = new Audio();
let playList = [];
let playMap = {};
let index = 0;
// 模式 0顺序循环,1随机播放,2单曲循环
let model = 0;
// 音量 0静音,1一半,2全开
let speaker = 2;
// 默认音量全开
audio.volume = 1.0
// 事件 播放完毕
audio.onended = () => {
    if (model == 0) playNext()
    else if (model == 1) playRandomMusic()
    else if (model == 2) playMusic(playList[index])
};

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
        sendEvent('pause', { status: playStatus(false) });
    },
    next() {
        if (model == 1) playRandomMusic()
        else playNext()
    },
    last() {
        if (model == 1) playRandomMusic()
        else playLast()
    }, 
    switchModel(newModel){
        model = newModel;
    },
    switchSpeaker(newSpeaker){
        speaker = newSpeaker;
        if(speaker == 0) audio.volume = 0.0;
        else if(speaker == 1) audio.volume = 0.5;
        else if(speaker == 2) audio.volume = 1.0;
    },
    getNow() {
        let code = playList[index]
        if (code) return {
            info: playMap[code],
            status: playStatus()
        }
        else return {
            status: playStatus()
        }
    },
    getStatus() {
        return playStatus()
    }
}

// 监听主线程 开始播放
ipcRenderer.on('player-play', () => {
    let code = playList[index];
    if (code) {
        playMusic(code);
    }
});

// 监听主线程 恢复播放
ipcRenderer.on('player-pause', () => {
    audio.pause();
    sendEvent('pause', { status: playStatus(false) });
    console.log('[Player] Pause playback')
});

// 播放音乐
function playMusic(code) {
    if (code == undefined) code = playList[index];
    let item = playMap[code];
    if (item) {
        // 单曲循环 or 音频地址变化 or 播单位置变化
        if (model == 2 || !audio.src || playList.indexOf(code) != index) {
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
            sendEvent('play', { info: item, status: playStatus(true) });
            audio.src = music.path;
            audio.load();
        } else sendEvent('restore', { info: item, status: playStatus(true) });
        audio.play();
    } else sendEvent('error')
}
// 播放下一首
function playNext() {
    playMusic(playList[index == playList.length - 1 ? 0 : index + 1])
    console.log('[Player] Play next music')
}
// 播放上一首
function playLast() {
    if (index == 0) return false;
    playMusic(playList[index - 1])
    console.log('[Player] Play last music')
}
// 播放随机曲目
function playRandomMusic() {
    index = Math.floor(Math.random() * (playList.length + 1));
    playMusic(playList[index])
}
// 获取播放状态
function playStatus(force) {
    return {
        currentTime: audio.currentTime,
        play: force == undefined ? !audio.paused : force,
        muted: audio.muted,
        playbackRate: audio.playbackRate,
        speaker,
        model
    }
}
// 发送事件
function sendEvent(action, data) {
    const event = new CustomEvent("player-event", { detail: { action, data } })
    document.dispatchEvent(event)
}