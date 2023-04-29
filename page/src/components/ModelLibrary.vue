<template>
    <div id="library-box">
        <div id="library-header">
            <div id="library-search">
                <Search12Filled id="search-icon" />
                <input id="search-input" type="text" placeholder="在资料库中搜索...">
            </div>
            <div id="window-controller" @click="closeWindow">
                <Close id="window-close" />
            </div>
        </div>
        <div id="library-tips">
            Steam OST Player
        </div>
    </div>
</template>
  
<script>
import { close } from '#preload';
import { Search12Filled } from '@vicons/fluent'
import { Close } from '@vicons/carbon'

export default {
    name: "ModelPlayer",
    components: { Search12Filled, Close },
    data: () => ({

    }),
    methods: {
        closeWindow() {
            close()
        }
    }
};
</script>
  
<style scoped>
#library-header {
    border-bottom: 1px solid #33383d;
    justify-content: space-between;
    border-radius: 0 12px 0 0;
    -webkit-app-region: drag;
    display: flex;
    width: 730px;
}

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
    border-radius: 12px;
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
    border-radius: 0 12px 0 0;
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
</style>