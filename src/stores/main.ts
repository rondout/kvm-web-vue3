/*
 * @Author: shufei.han
 * @Date: 2024-08-01 09:38:34
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-15 11:02:19
 * @FilePath: \kvm-web-vue3\src\stores\main.ts
 * @Description: 
 */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { defaultTheme } from '@/models/theme.model'
import { darken, lighten } from 'color2k'

export const useMainStore = defineStore('main', () => {
  const theme = ref(defaultTheme)

  const changePrimary = (value: string) => {
    theme.value.primary.main = value
    theme.value.primary.dark = darken(value, 0.2)
    theme.value.primary.light = lighten(value, 0.2)
  }

  return { theme, changePrimary }
})
