/*
 * @Author: shufei.han
 * @Date: 2024-10-16 11:35:20
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-21 10:28:12
 * @FilePath: \kvm-web-vue3\src\hooks\useSocketMsgs.ts
 * @Description: 
 */
import { generateMjpegUrl, WsEventType } from '@/models/kvm.model';
import { useMsgStore } from '@/stores/message';
import { onMounted, ref, watch } from 'vue';
export function useWsApiSocketMsgs() {
    const msgStore = useMsgStore()
    const mjpegUrl = ref<string>()
    const callbacks = {} as {[key in WsEventType]: (data: any) => void}

    onMounted(() => {
        // 首先建立socket连接
        msgStore.initApiWsMsgs()
    })

    watch(() => msgStore.latestWsApiMessage, (newValue) => {
        switch (newValue.event_type) {
            case WsEventType.STREAMER_STATE:
                if (!mjpegUrl.value) {
                    mjpegUrl.value = generateMjpegUrl()
                }
                callbacks[newValue.event_type](newValue.event)
                break
        }
    })

    const on = (msgType: WsEventType, callback: (data: any) => void) => {
        switch (msgType) {
            case WsEventType.STREAMER_STATE:
                callbacks[msgType] = callback
                break
        }
    }

    return { mjpegUrl, on }
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