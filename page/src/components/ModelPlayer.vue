<template>
    <div id="player-box">
        <div id="player-cover" :style="{ 'background-image': `url(${info.cover})` }"></div>
        <div id="player-info">
            <div class="line-1" id="info-game">{{ info.game }}</div>
            <div class="line-1" id="info-name">{{ info.name }}</div>
            <div class="line-1" id="info-artist">{{ info.artist }}</div>
            <div id="info-time" v-if="info.name">
                <div id="time-play">{{ playTimeText }}</div>
                <div>/</div>
                <div id="time-all">{{ info.duration }}</div>
            </div>
        </div>
        <div id="player-controller">
            <div id="controller-circulate" @click="switchModel">
                <ArrowRepeatAll24Filled v-if="model == 0" />
                <ArrowRouting24Filled v-else-if="model == 1" />
                <ArrowSync24Filled v-else-if="model == 2" />
            </div>
            <div id="controller-pre" @click="last">
                <Previous48Filled />
            </div>
            <div id="controller-pause" v-if="isPlay" @click="pause">
                <Pause48Filled />
            </div>
            <div id="controller-play" v-else @click="play">
                <Play48Filled />
            </div>
            <div id="controller-next" @click="next">
                <Next48Filled />
            </div>
            <div id="controller-speaker" @click="switchSpeaker">
                <SpeakerMute48Filled v-if="speaker == 0" />
                <Speaker148Filled v-else-if="speaker == 1" />
                <Speaker248Filled v-else-if="speaker == 2" />
            </div>
        </div>
        <div id="refresh" :class="{ disable: loading }" @click="refreshLibrary">{{ tips }}</div>
        <div id="version">Steam OST Player v{{ version }}</div>
    </div>
</template>
  
<script>
import { run, getItem, player, getVersion } from '#preload';
import { Play48Filled, Pause48Filled, Next48Filled, Previous48Filled, ArrowRepeatAll24Filled, ArrowSync24Filled, ArrowRouting24Filled, SpeakerMute48Filled, Speaker148Filled, Speaker248Filled } from '@vicons/fluent'

export default {
    name: "ModelPlayer",
    components: { Play48Filled, Pause48Filled, Next48Filled, Previous48Filled, ArrowRepeatAll24Filled, ArrowSync24Filled, ArrowRouting24Filled, SpeakerMute48Filled, Speaker148Filled, Speaker248Filled },
    data: () => ({
        isPlay: false,
        loading: false,
        tips: '更新资料库',
        timer: 0,
        playTime: 0,
        playTimeText: '00:00',
        info: {
            name: '',
            game: '',
            cover: 'cover.svg',
            artist: '',
            duration: ''
        },
        model: 0,
        speaker: 2,
        version: '0.0.0'
    }),
    methods: {
        init() {
            this.version = getVersion();
            let now = player.getNow();
            if (now.info) this.updateInfo(now.info);
            this.updateStatus(now.status);
        },
        eventHandle(action, data) {
            console.log(action, data)
            switch (action) {
                case 'play':
                    this.playTime = 0;
                    this.playTimeText = this.getDuration(0);
                    this.startTime();
                    this.isPlay = true;
                    if (data.info) this.updateInfo(data.info);
                    break;
                case 'restore':
                    // this.isPlay = true;
                    this.updateStatus(data.status);
                    break;
                case 'pause':
                    // this.isPlay = false;
                    this.updateStatus(data.status);
                    break;
                case 'error':
                    this.isPlay = false;
                    clearInterval(this.timer);
                    alert('播放失败');
                    break;
                default:
                    break;
            }
        },
        updateInfo(info) {
            this.info = {
                name: info.name,
                game: info.game,
                artist: info.artist,
                duration: info.duration
            }
            this.loadMuiscData(info.code);
        },
        updateStatus(status) {
            this.model = status.model;
            this.speaker = status.speaker;
            this.isPlay = status.play;
            this.playTime = parseFloat(status.currentTime).toFixed(0);
            this.playTimeText = this.getDuration(this.playTime);
            if (this.isPlay) this.startTime();
            else clearInterval(this.timer);
        },
        loadMuiscData(code) {
            getItem(code).then(res => {
                this.info = {
                    name: res.name,
                    game: res.game,
                    cover: 'cover.svg',
                    artist: res.artist,
                    duration: this.getDuration(res.duration)
                }
                if (res.cover) {
                    setTimeout(() => {
                        this.info.cover = res.cover
                    }, 300);
                }
                console.log('loadMuiscData', res)
            }).catch(err => {
                console.log(err)
            })
        },
        switchModel(){
            if(this.model == 2) this.model = 0;
            else this.model = this.model + 1;
            player.switchModel(this.model)
        },
        switchSpeaker(){
            if(this.speaker == 2) this.speaker = 0;
            else this.speaker = this.speaker + 1;
            player.switchSpeaker(this.speaker)
        },
        play() {
            if (this.isPlay) return false;
            this.isPlay = true;
            player.play()
        },
        pause() {
            if (!this.isPlay) return false;
            this.isPlay = false;
            player.pause()
        },
        last() {
            this.isPlay = true;
            player.last()
        },
        next() {
            this.isPlay = true;
            player.next()
        },
        refreshLibrary() {
            if (this.loading) return false;
            let state = confirm('此操作将读取您的 Steam 资料库, 然后将可用的 OST 存入播放器数据库中, 确认要更新资料库吗？')
            if (!state) return false;
            this.loading = true;
            this.tips = '正在读取 Steam 资料库...'
            run().then(() => {
                this.tips = '正在解析 OST 数据...'
                setTimeout(() => {
                    this.loading = false;
                    this.tips = '更新资料库';
                }, 5000);
            }).catch(err => {
                console.log('refresh library error')
            })
        },
        getDuration(num) {
            let m = '';
            if (num > 59) {
                m = parseInt(num / 60).toFixed(0).toString().padStart(2, '0');
                num = num - (parseInt(m) * 60);
            }
            num = num.toString().padStart(2, '0');
            if (m == '') return '00:' + num;
            return m + ':' + num;
        },
        startTime() {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.playTime++;
                this.playTimeText = this.getDuration(this.playTime)
            }, 1000);
        },
        clearTime() {
            this.playTime == 0;
            this.playTimeText = '00:00';
            clearInterval(this.timer);
            this.timer = 0;
            this.startTime();
        }
    },
    mounted() {
        setTimeout(() => this.init(), 500)
    }
};
</script>
  
<style scoped>
#player-box {
    background-color: #2b3548;
    border-radius: 8px 0 0 8px;
    -webkit-app-region: no-drag;
    position: relative;
    padding: 10px;
    height: 600px;
    width: 270px;
}

#player-cover {
    background: url(cover.svg) no-repeat;
    -webkit-app-region: drag;
    background-color: #1b2230;
    background-size: 100% 100%;
    border-radius: 8px;
    height: 250px;
    width: 250px;
}

#player-info {
    position: relative;
    width: 250px;
    height: 68px;
}

#info-game {
    background-color: rgba(42, 46, 51, 0.8);
    -webkit-app-region: no-drag;
    border-radius: 15px;
    position: absolute;
    padding: 5px 10px;
    font-size: 12px;
    color: #fff;
    top: -38px;
    left: 3px;
}

#info-game:hover {
    background-color: #2a2e33;
}

#info-name {
    text-align: center;
    margin-top: 5px;
    font-size: 16px;
    padding: 0 5px;
    color: #fff;
}

#info-artist {
    text-align: center;
    color: #b8bcc1;
    font-size: 14px;
    padding: 0 5px;
}

#info-time {
    justify-content: center;
    align-items: center;
    font-size: 12px;
    display: flex;
}

#time-play {
    margin-right: 5px;
    text-align: right;
    width: 35px;
}

#time-all {
    margin-left: 5px;
    width: 35px;
}

#player-controller {
    justify-content: center;
    align-items: center;
    margin: 10px 0;
    display: flex;
}

#controller-play,
#controller-pause {
    transition: all ease-out 0.3s;
    background-color: #2b73f7;
    border-radius: 50%;
    cursor: pointer;
    margin: 0 10px;
    padding: 10px;
    color: #fff;
    width: 50px;
}

#controller-play:hover,
#controller-pause:hover {
    background-color: #2565db;
    color: #e3e3e3;
}

#controller-play:active,
#controller-pause:active {
    background-color: #1c59ca;
    color: #e3e3e3;
}

#controller-circulate,
#controller-pre,
#controller-next,
#controller-speaker {
    cursor: pointer;
    margin: 0 10px;
    width: 20px;
}

#controller-circulate:hover,
#controller-pre:hover,
#controller-next:hover,
#controller-speaker:hover {
    color: #fff;
}

#refresh {
    transition: all ease-out 0.3s;
    background-color: #394458;
    width: calc(100% - 20px);
    border-radius: 8px;
    text-align: center;
    position: absolute;
    cursor: pointer;
    color: #fff;
    padding: 5px;
    bottom: 28px;
    left: 10px;
}

#refresh:hover {
    background-color: #4a566d;
}

#refresh:active {
    background-color: #59667e;
}

#refresh.disable {
    color: #b8bcc1;
    cursor: wait;
}

#version {
    text-align: center;
    position: absolute;
    color: #707880;
    font-size: 12px;
    width: 250px;
    bottom: 5px;
    left: 10px;
}
</style>
  