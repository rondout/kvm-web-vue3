/*
 * @Author: shufei.han
 * @Date: 2024-10-16 11:35:20
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-16 15:52:46
 * @FilePath: \kvm-web-vue3\src\hooks\useSocketMsgs.ts
 * @Description: 
 */
import { generateMjpegUrl, WsEventType } from '@/models/kvm.model';
import { useMsgStore } from '@/stores/message';
import { onMounted, ref, watch } from 'vue';
export function useWsApiSocketMsgs() {
    const msgStore = useMsgStore()
    const mjpegUrl = ref<string>()

    onMounted(() => {
        // 首先建立socket连接
        msgStore.initApiWsMsgs()
    })

    watch(() => msgStore.latestWsApiMessage, (newValue) => {
        switch (newValue.event_type) {
            case WsEventType.STREAMER_STATE:
                console.log('newValue-stream-state: ', newValue)
                mjpegUrl.value = generateMjpegUrl()
                break
        }
    })

    return { mjpegUrl }
}

export function useJanusWsSocketMsgs() {
    const msgStore = useMsgStore()
    onMounted(() => {
        // 首先建立socket连接
        msgStore.initJanusWsMsgs()
    })

    watch(() => msgStore.latestJanusApiMessage, (newValue) => {
        console.log('newValue-janus: ', newValue)
    })

    return {}
}