<script setup>
import ReactiveSteam from '/@/components/ReactiveSteam.vue';
import ElectronVersions from '/@/components/ElectronVersions.vue';

const APP_VERSION = import.meta.env.VITE_APP_VERSION;
</script>

<template>
  <div style="display: flex;align-items: center;justify-content: center;">
    <img alt="Vue logo" src="../assets/logo.svg" width="100" />
    <div style="margin-left: 10px;">
      <p>
        应用版本: {{ APP_VERSION }}
      </p>
      <p>
        <a href="https://github.com/cawa-93/vite-electron-builder" target="_blank">配置文档</a>
      </p>
    </div>
  </div>

  <fieldset>
    <legend>测试 Core API</legend>
    <reactive-steam />
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
  margin: 20px auto;
  max-width: 700px;
}

fieldset {
  margin: 1rem;
  padding: 1rem;
}
</style>
