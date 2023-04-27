<template>
  <div>
    <div>Steam Path: {{ steamPath }}</div>
    <div style="display: flex;justify-content: center;">
      <div>Steam Library:</div>
      <div style="text-align: left;margin-left: 5px;">
        <div v-for="item in library">{{ item }}</div>
      </div>
    </div>
    <button @click="scan">扫描</button>
  </div>
</template>

<script>
import { findSteam, findLibrary, scanLibrary } from '#preload';

export default {
  name: "ReactiveSteam",
  data: () => ({
    steamPath: '',
    library: []
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
