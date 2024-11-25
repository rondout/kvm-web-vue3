<!--
 * @Author: shufei.han
 * @Date: 2024-10-16 10:26:33
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-25 16:32:51
 * @FilePath: \kvm-web-vue3\src\views\kvm\KvmPageHeader.vue
 * @Description: 
-->
<template>
    <div class="kvm-page-header flex-btw">
        <KvmLogo class="pointer" />
        <div class="flex">
            <div class="info-box flex-start">
                <a-tooltip :title="kvmStore.streamStateTitle">
                    <img :src="linkSvgSrc" :class="{'link-img': true, 'img-enabled': msgStore?.connected}" alt="">
                </a-tooltip>
                <img :src="streamSvgSrc" :class="{'link-img': true, 'stream-status': true, 'img-enabled': kvmStore.streamState}" alt="">
            </div>
            <a-radio-group button-style="solid" :value="mode" @change="handleChange">
                <a-radio-button :value="VideoStreamEnum.MJPEG">MJPEG</a-radio-button>
                <a-radio-button :value="VideoStreamEnum.WEBRTC">WEBRTC</a-radio-button>
            </a-radio-group>
        </div>
    </div>
</template>

<script setup lang="ts">
import KvmLogo from '@/components/KvmLogo.vue';
import { VideoStreamEnum } from '@/models/kvm.model';
import { RadioChangeEvent } from 'ant-design-vue';
import linkSvgSrc from '@/assets/imgs/led-link.svg'
import streamSvgSrc from '@/assets/imgs/led-stream.svg'
import { useMsgStore } from '@/stores/message';
import { useKvmStore } from '@/stores/kvm';

defineProps<{mode: VideoStreamEnum}>();
const msgStore = useMsgStore()
const kvmStore = useKvmStore()

const emits = defineEmits<{
    (e: 'update:mode', mode: VideoStreamEnum): void;
}>();

const handleChange = (ev:RadioChangeEvent) => {
    emits('update:mode', ev.target.value as VideoStreamEnum);
}


</script>

<style lang="scss" scoped>
.kvm-page-header {
    height: 50px;
    background-color: var(--primary-dark);
    padding: 0 16px;
    position: fixed;
    width: 100%;
    box-sizing: border-box;
    .info-box {
        .link-img {
            width: 20px;
            height: 20px;
            margin-right: 8px;
            filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg)
        }
        .stream-status {
            filter: invert(0.5);    
        }
        .img-enabled {
            filter:invert(0.5) sepia(1) saturate(5) hue-rotate(100deg);
        }
    }
}
</style>