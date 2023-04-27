<template>
  <label>Steam Path: {{ steamPath }}</label>
</template>

<script>
import { findSteam } from '#preload';

export default {
  name: "ReactiveSteam",
  data: () => ({
    steamPath: ''
  }),
  methods: {},
  mounted() {
    findSteam().then(res => {
      console.log(res)
      this.steamPath = res;
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
