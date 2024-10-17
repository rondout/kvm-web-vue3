<!--
 * @Author: shufei.han
 * @Date: 2024-10-16 10:26:33
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-16 17:10:09
 * @FilePath: \kvm-web-vue3\src\views\kvm\KvmPageHeader.vue
 * @Description: 
-->
<template>
    <div class="kvm-page-header flex-btw">
        <KvmLogo class="pointer" />

        <div class="flex">
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

defineProps<{mode: VideoStreamEnum}>();

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
}
</style>