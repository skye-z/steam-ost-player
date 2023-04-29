<template>
    <div id="player-box">
        <div id="player-cover" :style="{'background-image': `url(${info.cover})`}"></div>
        <div id="player-info">
            <div class="line-1" id="info-game">{{ info.game }}</div>
            <div class="line-1" id="info-name">{{ info.name }}</div>
            <div class="line-1" id="info-artist">{{ info.artist }}</div>
        </div>
        <div id="player-controller">
            <div id="controller-circulate">
                <ArrowRepeatAll24Filled />
            </div>
            <div id="controller-pre">
                <Previous48Filled />
            </div>
            <div id="controller-pause" v-if="isPlay" @click="pause">
                <Pause48Filled />
            </div>
            <div id="controller-play" v-else @click="play">
                <Play48Filled />
            </div>
            <div id="controller-next">
                <Next48Filled />
            </div>
            <div id="controller-speaker">
                <Speaker248Filled />
            </div>
        </div>
    </div>
</template>
  
<script>
import { getItem, player } from '#preload';
import { Play48Filled, Pause48Filled, Next48Filled, Previous48Filled, ArrowRepeatAll24Filled, Speaker248Filled } from '@vicons/fluent'

export default {
    name: "ModelPlayer",
    components: { Play48Filled, Pause48Filled, Next48Filled, Previous48Filled, ArrowRepeatAll24Filled, Speaker248Filled },
    data: () => ({
        isPlay: false,
        info: {
            name: '',
            game: '',
            cover: '../assets/steam.svg',
            artist: '',
            duration: ''
        }
    }),
    methods: {
        eventHandle(action, data) {
            console.log(action, data)
            switch (action) {
                case 'play':
                    this.isPlay = true;
                    if (data) this.updateInfo(data)
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
            this.loadMuiscData(info.code)
        },
        loadMuiscData(code) {
            getItem(code).then(res => {
                this.info = {
                    name: res.name,
                    game: res.game,
                    cover: res.cover ? res.cover:'../assets/steam.svg',
                    artist: res.artist,
                    duration: res.duration
                }
                console.log('loadMuiscData', res)
            }).catch(err => {
                console.log(err)
            })
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
        }
    },
    mounted() {
        setTimeout(() => {
            let now = player.getNow();
            if (now) this.updateInfo(now)
        }, 500)
    }
};
</script>
  
<style scoped>
#player-box {
    background-color: #2b3548;
    border-radius: 8px 0 0 8px;
    -webkit-app-region: no-drag;
    padding: 10px;
    height: 600px;
    width: 270px;
}

#player-cover {
    background: url(../assets/steam.svg) no-repeat;
    background-color: #1b2230;
    background-size: 100% 100%;
    border-radius: 8px;
    height: 250px;
    width: 250px;
}

#player-info {
    position: relative;
    overflow: hidden;
    width: 250px;
    height: 50px;
}

#info-game {
    background-color: rgba(0, 0, 0, .3);
    border-radius: 15px;
    position: absolute;
    padding: 5px 10px;
    font-size: 12px;
    top: -40px;
    left: 5px;
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
    margin: 0 10px;
    width: 20px;
}
</style>
  