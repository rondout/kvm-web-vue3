/*
 * @Author: shufei.han
 * @Date: 2024-10-15 10:42:00
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-15 10:59:25
 * @FilePath: \kvm-web-vue3\src\main.ts
 * @Description: 
 */
import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import antDesign from 'ant-design-vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(antDesign)

app.mount('#app')
