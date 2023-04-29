<template>
  <div id="main-box">
    <model-player />
    <model-library />
  </div>
  <!-- <div style="display: flex;align-items: center;justify-content: center;">
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
  <div>
    <legend>测试 Core API</legend>
    <reactive-steam />
  </div> -->
</template>

<script>
import ReactiveSteam from '/@/components/ReactiveSteam.vue';
import ModelPlayer from '/@/components/ModelPlayer.vue';
import ModelLibrary from '/@/components/ModelLibrary.vue';
const APP_VERSION = import.meta.env.VITE_APP_VERSION;

export default {
  name: "App",
  components: { ModelPlayer, ModelLibrary },
  data: () => ({
  }),
  methods: {
  },
  mounted() {
  }
};
</script>

<style>
@import url(./style.css);

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #2a2e33;
  border-radius: 8px;
  color: #b8bcc1;
  width: 1000px;
  height: 600px;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

#main-box {
  overflow: hidden;
  display: flex;
}
</style>
