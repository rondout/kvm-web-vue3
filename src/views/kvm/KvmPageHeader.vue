<!--
 * @Author: shufei.han
 * @Date: 2024-10-16 10:26:33
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-16 10:37:52
 * @FilePath: \kvm-web-vue3\src\views\kvm\KvmPageHeader.vue
 * @Description: 
-->
<template>
<div class="kvm-page-header flex-btw">
    <KvmLogo class="pointer" />
</div>
</template> 

<script setup lang="ts">
import KvmLogo from '@/components/KvmLogo.vue';

  
</script> 

<style lang="scss" scoped>
.kvm-page-header {
    height: 50px;
    background-color: var(--primary-dark);
    padding: 0 16px;
}
</style>