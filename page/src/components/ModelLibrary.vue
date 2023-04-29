<template>
    <div id="library-box">
        <div id="library-header">
            <div id="header-tools">
                <div id="library-search">
                    <Search12Filled id="search-icon" />
                    <input id="search-input" type="text" placeholder="在资料库中搜索...">
                </div>
                <div id="window-controller" @click="closeWindow">
                    <Close id="window-close" />
                </div>
            </div>
            <div id="list-header" v-if="number > 0">
                <div class="item-name">曲名</div>
                <div class="item-artist">艺术家</div>
                <div class="item-source">音源</div>
            </div>
        </div>
        <div id="library-tips" v-if="number == 0">
            Steam OST Player
        </div>
        <div id="library-list" v-else>
            <div class="library-item" v-for="(item, index) in library" @click="playMusic(item.code, index)">
                <div class="item-info" :class="{ playing: playing == index }">
                    <div class="item-name lint-1">
                        <MusicNote216Filled class="playing-icon" v-if="playing == index" />
                        {{ item.name }}
                    </div>
                    <div class="item-artist">{{ item.artist }}</div>
                    <div class="item-source">
                        <template v-for="sub in item.containers">
                            <span class="source-item" :class="{ lossless: sub.lossless }">{{ sub.name }}</span>
                        </template>
                    </div>
                </div>
                <div class="item-game">{{ item.game }}</div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { close, getList, player } from '#preload';
import { Search12Filled, MusicNote216Filled } from '@vicons/fluent'
import { Close } from '@vicons/carbon'

export default {
    name: "ModelLibrary",
    components: { Search12Filled, MusicNote216Filled, Close },
    data: () => ({
        library: {},
        number: 0,
        playing: -1
    }),
    methods: {
        eventHandle(action, data) {
            console.log(action, data)
        },
        getLibraryList() {
            getList().then(res => {
                console.log(res)
                if (res) {
                    this.library = res;
                    this.number = Object.keys(res).length;
                    console.info('get %d pieces of music', this.number)
                    player.load(JSON.parse(JSON.stringify(res)));
                }
            }).catch(error => {
                console.error('get music list error', error)
            })
        },
        playMusic(code, index) {
            player.play(code);
            this.playing = index;
        },
        closeWindow() {
            close()
        }
    },
    mounted() {
        setTimeout(() => {
            this.getLibraryList();
        }, 300);
    }
};
</script>
  
<style scoped>
#library-header {
    border-bottom: 1px solid #33383d;
    border-radius: 0 8px 0 0;
}

#header-tools {
    border-bottom: 1px solid #33383d;
    justify-content: space-between;
    border-radius: 0 8px 0 0;
    -webkit-app-region: drag;
    display: flex;
    width: 730px;
}

#library-search {
    position: relative;
    display: flex;
}

#search-icon {
    position: absolute;
    width: 22px;
    left: 18px;
    top: 15px;
}

#search-input {
    background-color: #31363b;
    -webkit-app-region: no-drag;
    padding: 5px 5px 5px 35px;
    border-radius: 8px;
    line-height: 22px;
    font-size: 16px;
    outline: none;
    border: none;
    margin: 10px;
    width: 250px;
}

#search-input:focus {
    outline: 2px solid #1c59ca;
    background-color: #374866;
}

#library-tips {
    justify-content: center;
    align-items: center;
    font-weight: 900;
    color: #3a3f46;
    font-size: 60px;
    display: flex;
    height: 490px;
    width: 100%;
}

#window-controller {
    transition: all ease-out 0.3s;
    -webkit-app-region: no-drag;
    background-color: #40464d;
    border-radius: 0 8px 0 0;
    justify-content: center;
    align-items: center;
    color: #fff;
    display: flex;
    height: 26px;
    width: 47px;
}

#window-controller:hover {
    background-color: #e81123;
}

#window-close {
    font-weight: 100;
    width: 22px;
}

#library-list {
    border-radius: 0 0 8px 0;
    overflow-y: overlay;
    overflow-x: hidden;
    max-height: 511px;
    min-height: 511px;
    height: 511px;
    width: 100%;
}

#list-header {
    border-bottom: 1px solid #33383d;
    align-items: center;
    font-size: 16px;
    display: flex;
    padding: 5px 10px;
}

.library-item {
    border-bottom: 1px solid #33383d;
    cursor: pointer;
    padding: 10px;
}

.library-item:hover {
    background-color: #33383d;
}

.library-item:active {
    background-color: #3f4449;
}

.item-info {
    align-items: center;
    font-size: 16px;
    display: flex;
}

.item-name {
    width: 420px;
}

.playing .item-name {
    align-items: center;
    display: flex;
    color: #fff;
}

.playing-icon {
    margin-right: 3px;
    margin-left: -5px;
    width: 16px;
}

.item-artist {
    width: 165px;
}

.item-source {
    width: 125px;
    text-align: right;
}

.item-game {
    font-size: 12px;
}

.source-item {
    background-color: #31363b;
    margin-left: 5px;
    font-size: 12px;
    padding: 5px;
}

.source-item.lossless {
    font-weight: bold;
    color: #EEE8AA;
}
</style>