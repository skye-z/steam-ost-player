<script setup>
import ReactiveCounter from '/@/components/ReactiveCounter.vue';
import ReactiveHash from '/@/components/ReactiveHash.vue';
import ElectronVersions from '/@/components/ElectronVersions.vue';

const APP_VERSION = import.meta.env.VITE_APP_VERSION;
</script>

<template>
  <img alt="Vue logo" src="../assets/logo.svg" width="150" />

  <p>
    应用版本: {{ APP_VERSION }}
  </p>
  <p>
    <a href="https://github.com/cawa-93/vite-electron-builder" target="_blank">配置文档</a>
  </p>

  <fieldset>
    <legend>测试 Vue</legend>
    <reactive-counter />
  </fieldset>

  <fieldset>
    <legend>测试 Node.js API</legend>
    <reactive-hash />
  </fieldset>

  <fieldset>
    <legend>环境信息</legend>
    <electron-versions />
  </fieldset>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  max-width: 700px;
}

fieldset {
  margin: 2rem;
  padding: 1rem;
}
</style>
