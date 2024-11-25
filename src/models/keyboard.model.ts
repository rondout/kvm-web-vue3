/*
* @Author: shufei.han
* @Date: 2024-11-25 10:49:45
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-25 15:28:07
 * @FilePath: \kvm-web-vue3\src\models\keyboard.model.ts
* @Description: 
*/
import { useMsgStore } from "@/stores/message";
import { sendHidEvent } from "./session.model";

const msgStore = useMsgStore()

export class KeyboardEventHandler {
    constructor(private el: HTMLElement) {
        this.init()
    }

    private init() {
        console.log(this.el);
        this.el.addEventListener("keydown", event => this.onKeyDownOrUp(event, true))
        this.el.addEventListener("keyup", event => this.onKeyDownOrUp(event, false))
    }

    private onKeyDownOrUp(event: KeyboardEvent, down: boolean) {
        event.preventDefault()
        this.sendEvent({key: event.code, state: down})
    }

    private sendEvent<T = {key: string; state: boolean;}>(event: T) {
        sendHidEvent(msgStore.sockets.apiWS, {event_type: 'key', event})
    }
}