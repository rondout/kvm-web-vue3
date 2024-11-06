<!--
 * @Author: shufei.han
 * @Date: 2024-10-16 10:39:46
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-06 14:24:58
 * @FilePath: \kvm-web-vue3\src\views\kvm\KvmWebRtcPlayer.vue
 * @Description: 
-->
<template>
    <div class="kvm-webRtc-player-container full-height">
        <div class="video-container full-height flex">
            WebRTC Player
        </div>
    </div>
</template>

<script setup lang="ts">
import { useJanusWsSocketMsgs } from '@/hooks/useSocketMsgs';
import { Janus } from '@/utils/janus';
import { onMounted } from 'vue';

// useJanusWsSocketMsgs()

onMounted(() => {
    Janus.init({})
    // @ts-ignore
    new Janus({
        server: 'ws://localhost:5173/janus/ws', success() {
            console.log("SUCCESS");
        },
        error(err) {
            console.log("ERROR: ", err);
        }
    })
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