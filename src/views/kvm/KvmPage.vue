<!--
 * @Author: shufei.han
 * @Date: 2024-10-16 10:17:54
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-25 16:02:14
 * @FilePath: \kvm-web-vue3\src\views\kvm\KvmPage.vue
 * @Description: 
-->
<template>
    <div class="kvm-page-container full-height">
        <KvmPageHeader v-model:mode="mode" />
        <div class="kvm-page-content">
            <!-- <KvmMjpegPlayer v-if="mode === VideoStreamEnum.MJPEG" /> -->
            <KvmWebRtcPlayer :streamState="state.streamerState" v-if="mode === VideoStreamEnum.WEBRTC" />
        </div>
    </div>
</template>

<script setup lang="ts">
import KvmPageHeader from './KvmPageHeader.vue';
import KvmMjpegPlayer from './KvmMjpegPlayer.vue';
import { VideoStreamEnum } from '@/models/kvm.model';
import { ref } from 'vue';
import KvmWebRtcPlayer from './KvmWebRtcPlayer.vue';
import { useWsApiSocketMsgs } from '@/hooks/useSocketMsgs';
import { useMsgStore } from '@/stores/message';

const apiMsg = useWsApiSocketMsgs()
const state = useMsgStore()

const mode = ref(VideoStreamEnum.WEBRTC);

</script>

<style lang="scss" scoped>
.kvm-page-container {
    overflow: auto;

    .kvm-page-content {
        height: 100%;
        padding-top: 50px;
        box-sizing: border-box;
    }
}
</style>