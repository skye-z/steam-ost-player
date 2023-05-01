<template>
    <div id="library-box">
        <div id="library-header">
            <div id="header-tools">
                <div id="tools-left">
                    <div id="library-search">
                        <Search12Filled id="search-icon" />
                        <input v-model="keyword" id="search-input" type="text" @input="inputSearch"
                            placeholder="在资料库中搜索...">
                    </div>
                    <div id="refresh" @click="refresh">{{ loading ? '刷新中' : '刷新' }}</div>
                    <div id="library-number">{{ number }} 首</div>
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
            <template v-for="item in library">
                <div class="library-item" @click="playMusic(item.code, index)" v-if="!isSearch || item.exclude === 'N'">
                    <div class="item-info" :class="{ playing: playing == item.code }">
                        <div class="item-name lint-1">
                            <MusicNote216Filled class="playing-icon" v-if="playing == item.code" />
                            {{ item.name }}
                        </div>
                        <div class="item-artist">{{ item.artist }}</div>
                        <div class="item-source">
                            <template v-for="sub in item.containers">
                                <span class="source-item" :class="{ lossless: sub.lossless }">{{ sub.name }}</span>
                            </template>
                        </div>
                    </div>
                    <div class="item-duration">{{ item.duration }}</div>
                    <div class="item-game">{{ item.game }}</div>
                </div>
            </template>
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
        loading: false,
        library: {},
        number: 0,
        keyword: '',
        playing: '',
        isSearch: false,
        timer: 0
    }),
    methods: {
        eventHandle(action, data) {
            switch (action) {
                case 'play':
                    this.playing = data.info.code;
                    break;
                default:
                    break;
            }
        },
        getLibraryList() {
            getList().then(res => {
                if (res) {
                    for (let i in res) {
                        res[i].duration = this.getDuration(res[i].duration)
                    }
                    this.library = res;
                    this.number = Object.keys(res).length;
                    console.info('get %d pieces of music', this.number)
                    player.load(JSON.parse(JSON.stringify(res)));
                }
                this.loading = false;
            }).catch(error => {
                console.error('get music list error', error)
                this.loading = false;
            })
        },
        refresh() {
            if (this.loading) return false;
            this.loading = true;
            setTimeout(() => this.getLibraryList(), 500)
        },
        playMusic(code) {
            player.play(code);
            this.playing = code;
        },
        inputSearch() {
            this.timer = setTimeout(() => {
                this.timer = 0;
                this.search(this.keyword.toLowerCase());
            }, 800);
        },
        search(key) {
            if (!key) {
                this.isSearch = false;
                return false;
            }
            for (let i in this.library) {
                let state = 0;
                let item = this.library[i];
                if (item.name.toLowerCase().indexOf(key) == -1) state++;
                if (item.game.toLowerCase().indexOf(key) == -1) state++;
                if (item.artist) {
                    if (item.artist.toLowerCase().indexOf(key) == -1) state++;
                } else state++;
                if (state == 3) this.library[i].exclude = 'Y';
                else this.library[i].exclude = 'N';
            }
            this.isSearch = true;
        },
        closeWindow() {
            close()
        },
        getDuration(num) {
            let m = '';
            if (num > 59) {
                m = parseInt(num / 60).toFixed(0);
                num = num - (parseInt(m) * 60);
            }
            if (m == '') return '0:' + num;
            return m + ':' + num;
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
    -webkit-app-region: drag;
    border-radius: 0 8px 0 0;
}

#header-tools {
    border-bottom: 1px solid #33383d;
    justify-content: space-between;
    border-radius: 0 8px 0 0;
    display: flex;
    width: 730px;
}

#tools-left,
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

#refresh,
#library-number {
    transition: all ease-out 0.3s;
    background-color: #31363b;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    display: flex;
    color: #fff;
    margin: 10px 0;
    height: 32px;
    width: 80px;
}

#refresh {
    -webkit-app-region: no-drag;
    cursor: pointer;
}

#library-number {
    margin-left: 10px;
}

#refresh:hover {
    background-color: #373d42;
}

#refresh:active {
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

.item-duration {
    padding: 5px 10px 0 0;
    font-size: 12px;
    float: right;
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