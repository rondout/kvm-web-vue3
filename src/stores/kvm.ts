/*
 * @Author: shufei.han
 * @Date: 2024-08-01 09:38:34
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-25 16:30:49
 * @FilePath: \kvm-web-vue3\src\stores\kvm.ts
 * @Description: 
 */
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ExtraKvmApp, KvmExtraApps, KvmExtraAppsConfigMap, KvmInfo } from '@/models/kvm.model'
import { mainService } from '@/api/main'
import logoutSvg from "@/assets/imgs/logout.svg"
import { userService } from '@/api/user'
import router from '@/router'

export const useKvmStore = defineStore('kvm', () => {

  const kvmInfo = ref<KvmInfo>()
  const kvmInfoLoading = ref(false)
  const streamState = ref(false)

  const getKvmInfo = async (withParams = true) => {
    try {
      kvmInfoLoading.value = true
      console.log("get_kvm_info");
      const res = await mainService.loadKvmInfo(withParams ? { fields: 'auth,meta,extras' } : null)
      kvmInfo.value = res
      kvmInfoLoading.value = false
    } catch (error) {
      console.log(error);

      kvmInfoLoading.value = false
    }
  }

  const apps = computed<ExtraKvmApp[]>(() => {
    const appList = []
    if (!kvmInfo.value) {
      return appList
    }

    // kvm app
    const hideKvmButton = kvmInfo.value?.meta?.web?.hide_kvm_button
    if (!hideKvmButton) {
      appList.push(KvmExtraAppsConfigMap.get(KvmExtraApps.JANUS))
    }
    const extraApps = Object.entries(kvmInfo.value.extras).map(([key, value]) => ({ ...value, key: key as KvmExtraApps })).sort((a, b) => {
      // 这个排序是PI-KVM本身的逻辑
      if (a.place < b.place) {
        return -1;
      } else if (a.place > b.place) {
        return 1;
      } else {
        return 0;
      }
    })
    // extra apps
    extraApps.forEach(app => {
      if (app.place >= 0 && (app.enabled || app.started)) {
        appList.push(KvmExtraAppsConfigMap.get(app.key))
      }
    })
    // logout app
    if (kvmInfo.value?.auth?.enabled) {
      appList.push(new ExtraKvmApp("Logout", null, logoutSvg, async () => {
        await userService.logout()
        router.push({ name: 'login' })
      }))
    }
    return appList.filter(item => !!item)
  })

  const setStreamState = (state: boolean) => {
    streamState.value = state
  }

  const streamStateTitle = computed(() => {
    if (streamState.value) {
      return "Stream is active"
    }
    return "Stream inactive"
  })

  return { kvmInfo, kvmInfoLoading, getKvmInfo, apps, streamState, streamStateTitle, setStreamState }
})
