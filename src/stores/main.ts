/*
 * @Author: shufei.han
 * @Date: 2024-08-01 09:38:34
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-16 10:21:41
 * @FilePath: \kvm-web-vue3\src\stores\main.ts
 * @Description: 
 */
import { onMounted, ref } from 'vue'
import { defineStore } from 'pinia'
import { defaultTheme } from '@/models/theme.model'
import { darken, lighten } from 'color2k'
import { userService } from '@/api/user'

export const useMainStore = defineStore('main', () => {
  const theme = ref(defaultTheme)
  const getUserLoginStatusLoading = ref(true)
  const userLoggedIn = ref(false)

  const changePrimary = (value: string) => {
    theme.value.primary.main = value
    theme.value.primary.dark = darken(value, 0.2)
    theme.value.primary.light = lighten(value, 0.2)
  }

  onMounted(() => {
    // console.log('mainStore mounted')
    // changePrimary("#484b51")
    // changePrimary('#36a6b3')
  })

  const checkUserLoginStatus = async () => {
    try {
      getUserLoginStatusLoading.value = true
      await userService.checkLoginStatus()
      getUserLoginStatusLoading.value = false
      userLoggedIn.value = true
    } catch (error) {
      userLoggedIn.value = false
      getUserLoginStatusLoading.value = false
    }
  }

  return { theme, changePrimary, checkUserLoginStatus, userLoggedIn, getUserLoginStatusLoading }
})
