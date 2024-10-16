<!--
 * @Author: shufei.han
 * @Date: 2024-10-15 14:30:18
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-16 10:00:17
 * @FilePath: \kvm-web-vue3\src\views\NotFound.vue
 * @Description: 
-->
<template>
<div class="not-found flex flex-column full-height">
    <h1 class="color-primary">Sorry, Page Lost!</h1>
    <div class="flex">
        <a-button type="primary" @click="goHome">Go Home</a-button>
    </div>
</div>
</template> 

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
    router.push('/');
}
</script> 

<style lang="scss" scoped></style>