<!--
 * @Author: shufei.han
 * @Date: 2024-10-15 14:33:45
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-16 10:19:24
 * @FilePath: \kvm-web-vue3\src\views\layout\MainLayout.vue
 * @Description: 
-->
<template>
    <div class="main-layout full-height">
        <a-spin v-if="mainStore.getUserLoginStatusLoading" class="full-height flex">
        </a-spin>
        <RouterView v-else-if="mainStore.userLoggedIn" />
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { onMounted } from 'vue';

const mainStore = useMainStore()

onMounted(() => {
    mainStore.checkUserLoginStatus()
})
</script>

<style lang="scss" scoped>
.main-layout {
    background-color: var(--primary-light);
}
</style>