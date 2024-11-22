<!--
 * @Author: shufei.han
 * @Date: 2024-10-15 10:42:00
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-22 10:04:29
 * @FilePath: \kvm-web-vue3\src\App.vue
 * @Description: 
-->
<script setup lang="ts">
import { RouterView } from 'vue-router'
import useTheme from './hooks/useTheme';
import "@gl/main/style.css"

const { antdTheme: theme } = useTheme()
</script>

<template>
  <AConfigProvider :theme="theme">
    <RouterView />
  </AConfigProvider>
</template>

<style scoped></style>
