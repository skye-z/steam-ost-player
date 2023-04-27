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
        <button v-if="playing != index" @click="startMusic(item, index)">播放</button>
        <button v-else @click="stopMusic">暂停</button>
      </div>
    </div>
    <button @click="getMusicList" style="margin: 10px 0;">刷新列表</button>
    <button @click="stopMusic">暂停</button>
  </div>
</template>

<script>
import { findSteam, findLibrary, scanLibrary, getList, start, stop } from '#preload';

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
      }).catch(error => {
        console.log('get music list error', error)
      })
    },
    startMusic(item, index) {
      start(item.directory + '\\' + item.fileName);
      this.playing = index;
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
