<template>
  <div id="main-box">
    <model-player ref="player" />
    <model-library ref="library" />
  </div>
</template>

<script>
import ReactiveSteam from '/@/components/ReactiveSteam.vue';
import ModelPlayer from '/@/components/ModelPlayer.vue';
import ModelLibrary from '/@/components/ModelLibrary.vue';

export default {
  name: "App",
  components: { ModelPlayer, ModelLibrary },
  data: () => ({
  }),
  methods: {
    initListener() {
      document.addEventListener("player-event", e => {
        this.$refs.player.eventHandle(e.detail.action,e.detail.data)
        this.$refs.library.eventHandle(e.detail.action,e.detail.data)
      })
    }
  },
  mounted() {
    setTimeout(() => {
      this.initListener();
    }, 300);
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
