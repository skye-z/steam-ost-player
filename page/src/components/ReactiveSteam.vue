<template>
  <div>
    <div>Steam Path: {{ steamPath }}</div>
    <div style="display: flex;justify-content: center;">
      <div>Steam Library:</div>
      <div style="text-align: left;margin-left: 5px;">
        <div v-for="item in library">{{ item }}</div>
      </div>
    </div>
    <button @click="scan" style="margin: 10px 0;">扫描</button>
    <div>OST List</div>
    <div v-for="(item, index) in musicList" style="display: flex;justify-content: space-between;margin-bottom: 10px;"
      :style="{ color: playing == index ? '#4fcd75' : '#333333' }">
      <div>{{ item.name }}</div>
      <div>{{ item.artist }}</div>
      <div>{{ item.container }}</div>
      <div>
        <button v-if="playing != index" @click="playMusic(item.code, index)">播放</button>
        <button v-else @click="stopMusic">暂停</button>
      </div>
    </div>
    <div style="margin: 10px 0;">
      <button @click="getMusicList">刷新列表</button>
      <button @click="pauseMusic" style="margin: 0 10px;">暂停</button>
      <button @click="stopMusic">停止</button>
    </div>
  </div>
</template>

<script>
import { findSteam, findLibrary, scanLibrary, getList, load, play, pause, stop } from '#preload';

export default {
  name: "ReactiveSteam",
  data: () => ({
    steamPath: '',
    library: [],
    musicList: [],
    playing: -1
  }),
  methods: {
    find(path) {
      findLibrary(path).then(res => {
        this.library = res;
      }).catch(err => {
        console.log(err)
      })
    },
    scan() {
      let paths = JSON.parse(JSON.stringify(this.library));
      scanLibrary(paths).then(res => {
        console.log(res)
      }).catch(error => {
        console.log('read music list error', error)
      })
    },
    getMusicList() {
      getList().then(res => {
        this.musicList = res;
        load(JSON.parse(JSON.stringify(res)));
      }).catch(error => {
        console.log('get music list error', error)
      })
    },
    playMusic(code, index) {
      play(code);
      this.playing = index;
    },
    pauseMusic() {
      pause()
      this.playing = -1;
    },
    stopMusic() {
      stop()
      this.playing = -1;
    }
  },
  mounted() {
    findSteam().then(res => {
      this.steamPath = res;
      this.find(res);
    }).catch(err => {
      this.steamPath = err;
    })
  }
};
</script>

<style scoped>
table {
  margin: auto;
}

th {
  text-align: right;
}

td {
  text-align: left;
}
</style>
