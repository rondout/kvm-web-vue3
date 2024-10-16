<!--
 * @Author: shufei.han
 * @Date: 2024-10-15 14:42:08
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-15 18:40:52
 * @FilePath: \kvm-web-vue3\src\views\HomePage.vue
 * @Description: 
-->
<template>
    <div class="home-container full-height flex">
        <a-spin :spinning="kvmStore.kvmInfoLoading">
            <div class="home-content">
                <div class="header flex-start">
                    <div class="logo-text color-primary">Gl-KVM</div>
                </div>
                <a-divider style="background-color: #fff; margin: 12px 0;"></a-divider>
                <div class="server-info">
                    <span>Server: </span>
                    <a href="/api/info" class="server-link" target="_blank">{{ kvmStore.kvmInfo?.meta?.server.host
                        }}</a>
                </div>
                <a-divider style="background-color: #fff; margin: 12px 0;"></a-divider>
                <div class="apps-box flex">
                    <div v-for="item of kvmStore.apps" @click="handleAppClick(item)"
                        class="app-item pointer flex flex-column" :key="item.name">
                        <img :src="item.icon" alt="">
                        <div class="name">{{ item.name }}</div>
                    </div>
                </div>
                <a-divider style="background-color: #fff; margin: 12px 0;"></a-divider>
                <div class="info-box">
                    <p class="text">
                        Please note that when you are working with a KVM session or another application that captures
                        the keyboard,
                        you can't use some keyboard shortcuts such as Ctrl+Alt+Del (which will be caught by your OS) or
                        Ctrl+W (caught by your browser).
                    </p>
                </div>
            </div>
        </a-spin>
    </div>
</template>

<script setup lang="ts">
import { ExtraKvmApp } from '@/models/kvm.model';
import { useKvmStore } from '@/stores/kvm';
import { onMounted } from 'vue';

const kvmStore = useKvmStore();

const handleAppClick = (app: ExtraKvmApp) => {
    app.onClick?.();
}

onMounted(async () => {
    await kvmStore.getKvmInfo();
})
</script>

<style lang="scss" scoped>
.home-container {
    .home-content {
        width: 800px;
        padding: 16px;
        background-color: var(--primary);
        border-radius: 8px;
        color: var(--primary-contrast);

        .header {
            .logo-text {
                font-size: 32px;
                background-color: var(--grey-light);
                border-radius: 4px;
                padding: 4px 8px;
            }
        }
        font-size: 16px;
        .server-link {
            color: #fff;
            text-decoration: underline;
        }

        .apps-box {
            .app-item {
                height: 100px;
                width: 100px;
                text-align: center;
                background-color: var(--primary-dark);
                // box-shadow: var(--shadow-micro);
                border: 1px solid transparent;
                border-radius: 8px;
                margin: 0 8px;

                img {
                    padding-bottom: 5px;
                    height: 50px;
                    filter: invert(0.7);
                }

                &:hover {
                    border-color: #fff;
                }
            }
        }
    }
}
</style>