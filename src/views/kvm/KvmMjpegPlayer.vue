<!--
 * @Author: shufei.han
 * @Date: 2024-10-16 10:39:46
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-16 16:55:53
 * @FilePath: \kvm-web-vue3\src\views\kvm\KvmMjpegPlayer.vue
 * @Description: 
-->
<template>
    <div class="kvm-mjpeg-player-container full-height">
        <div class="video-container full-height flex">
            <img :src="mjpegUrl" id="stream-img" alt="">
        </div>
    </div>
</template>

<script setup lang="ts">
import { useWsApiSocketMsgs } from '@/hooks/useSocketMsgs';

const { mjpegUrl } = useWsApiSocketMsgs()

</script>

<style lang="scss" scoped>
.kvm-mjpeg-player-container {
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