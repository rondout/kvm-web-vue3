<!--
 * @Author: shufei.han
 * @Date: 2024-10-16 10:39:46
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-21 09:20:54
 * @FilePath: \kvm-web-vue3\src\views\kvm\KvmWebRtcPlayer.vue
 * @Description: 
-->
<template>
    <div class="kvm-webRtc-player-container full-height">
        <div class="video-container full-height flex">
            WebRTC Player
            <video id="stream-video" width="500" height="300" controls autoplay muted></video>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useJanusWsSocketMsgs } from '@/hooks/useSocketMsgs';
import { JanusStreamer } from '@/models/janus.model';
import { Janus } from '@/utils/janus';
import { onMounted, reactive } from 'vue';

// useJanusWsSocketMsgs()
const state = reactive({
    orient: 'landscape',
    allowAudio: true
})

const setActive = (...args: any) => {
    log('setActive', args)
}
const setInactive = (...args: any) => {
    log('setInactive', args)
}
const setInfo = (...args: any) => {
    log('setInfo', args)
}

const init = () => {
    const janus = new JanusStreamer(setActive, setInactive, setInfo, state.orient, state.allowAudio)
}

onMounted(() => {
    // Janus.init({})
    // // @ts-ignore
    // new Janus({
    //     server: 'ws://localhost:5173/janus/ws', success() {
    //         console.log("SUCCESS");
    //     },
    //     error(err) {
    //         console.log("ERROR: ", err);
    //     }
    // })
    init()
})

</script>

<style lang="scss" scoped>
.kvm-webRtc-player-container {
    min-width: 400px;
    min-height: 200px;
    resize: both;
    overflow: hidden;

    .video-container {
        img {
            width: 80%;
            background-color: red;
        }
    }
}
</style>