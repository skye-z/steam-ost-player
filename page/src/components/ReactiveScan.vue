<template>
  <div>
    <button @click="scan">扫描</button>
  </div>
</template>

<script>
import { scanLibrary } from '#preload';

export default {
  name: "ReactiveScan",
  data: () => ({}),
  methods: {
    scan() {
      scanLibrary(['E:\\cache\\steam-ost-player\\test']).then(res => {
        console.log(res)
      }).catch(error => {
        console.log('read music list error', error)
      })
    }
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
