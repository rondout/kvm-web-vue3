<template>
    <div @click="handleBack" class="kvm-logo-text pointer color-primary">Gl-KVM</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const handleBack = () => {
  if (route.path === "/") return  
  router.push("/")
}
</script>

<style lang="scss" scoped>
.kvm-logo-text {
    font-size: 32px;
    background-color: var(--grey-light);
    border-radius: 4px;
    padding: 0px 8px;
    // width: 128px;
    box-sizing: border-box;
    font-weight: bold;
}
</style>