/*
 * @Author: shufei.han
 * @Date: 2024-10-16 11:28:26
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-16 12:12:01
 * @FilePath: \kvm-web-vue3\src\stores\message.ts
 * @Description: 
 */
import { WebSocketService } from "@/api/websocket"
import { WsMessage } from "@/models/kvm.model"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useMsgStore = defineStore('msg', () => {
    const msgs = ref<WsMessage[]>([])
    const latestWsApiMessage = ref<WsMessage>()
    const latestJanusApiMessage = ref<WsMessage>()

    let apiWsSocket: WebSocketService | null = null
    let janusWsSocket: WebSocketService | null = null

    const initApiWsMsgs = async () => {
        if (apiWsSocket) {
            return
        }
        apiWsSocket = new WebSocketService('/api/ws', null, (data) => {
            latestWsApiMessage.value = data
            msgs.value.push(data)
        })
    }

    const initJanusWsMsgs = async () => {
        if (janusWsSocket) {
            return
        }
        janusWsSocket = new WebSocketService('/janus/ws', null, (data) => {
            latestJanusApiMessage.value = data
            msgs.value.push(data)
        })
    }

    return {
        msgs,
        latestWsApiMessage,
        latestJanusApiMessage,
        initApiWsMsgs,
        initJanusWsMsgs
    }
})