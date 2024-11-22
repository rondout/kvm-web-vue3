/*
 * @Author: shufei.han
 * @Date: 2024-10-16 11:28:26
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-21 16:12:19
 * @FilePath: \kvm-web-vue3\src\stores\message.ts
 * @Description: 
 */
import { WebSocketService } from "@/api/websocket"
import { StreamStateEventInfo, WsEventType, WsMessage } from "@/models/kvm.model"
import { defineStore } from "pinia"
import { reactive, ref } from "vue"

export const useMsgStore = defineStore('msg', () => {
    const msgs = ref<WsMessage[]>([])
    const latestWsApiMessage = ref<WsMessage>()
    const latestJanusApiMessage = ref<WsMessage>()
    const streamerState = ref<StreamStateEventInfo>()
    const metaState = ref<StreamStateEventInfo>()
    const systemState = ref<StreamStateEventInfo>()
    const extraState = ref<StreamStateEventInfo>()

    const sockets = reactive({
        apiWS: null as WebSocketService,
        janusWS: null as WebSocketService
    })
    const initApiWsMsgs = async () => {
        if (sockets.apiWS) {
            return
        }
        const socket = new WebSocketService<WsMessage>('/api/ws', null, (data) => {
            latestWsApiMessage.value = data
            msgs.value.push(data)
            parseData(data)
        })

        socket.on('open', () => {
            sockets.apiWS = socket
        })
    }

    const initJanusWsMsgs = async () => {
        if (sockets.apiWS) {
            return
        }
        const socket = new WebSocketService<WsMessage>('/janus/ws', 'janus-protocol', (data) => {
            latestJanusApiMessage.value = data
            msgs.value.push(data)
        })

        socket.on('open', () => {
            sockets.apiWS = socket
        })
    }

    const parseData = (data: WsMessage) => {
        switch (data.event_type) {
            case WsEventType.STREAMER_STATE:
                streamerState.value = data.event
                break
            case WsEventType.INFO_META_STATE:
                metaState.value = data.event
                break
            case WsEventType.INFO_EXTRAS_STATE:
                extraState.value = data.event
                break
            case WsEventType.INFO_SYSTEM_STATE:
                systemState.value = data.event
                break
        }
    }

    return ({
        msgs,
        latestWsApiMessage,
        latestJanusApiMessage,
        initApiWsMsgs,
        initJanusWsMsgs,
        streamerState,
        metaState,
        systemState,
        extraState,
        sockets
    })
})