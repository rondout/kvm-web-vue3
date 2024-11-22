import { useMsgStore } from "@/stores/message";
import { getGeometry, remap, sendHidEvent } from "./session.model";

/*
 * @Author: shufei.han
 * @Date: 2024-11-22 16:32:08
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-22 17:49:01
 * @FilePath: \kvm-web-vue3\src\models\mouse.model.ts
 * @Description: 
 */
const msgStore = useMsgStore()

export class MouseEventHandler {
    public absolute = true
    public planned_pos = { "x": 0, "y": 0 };

    constructor(private el: HTMLElement) {
        this.bindEvents()
    }

    private bindEvents() {
        this.el.addEventListener('mousemove', e => this.onMouseMove(e))
        this.el.addEventListener('mousedown', e => this.onMouseDown(e))
        this.el.addEventListener('mouseup', e => this.onMouseUp(e))
    }

    private onMouseMove(event: MouseEvent) {
        if (this.absolute) {
            // @ts-ignore
            let rect = event.target.getBoundingClientRect();
            this.planned_pos = {
                "x": Math.max(Math.round(event.clientX - rect.left), 0),
                "y": Math.max(Math.round(event.clientY - rect.top), 0),
            };
            console.log(this.planned_pos);
            const {x, y} = this.planned_pos;
            let geo = getGeometry()
            let to = {
                x: remap(x, geo.x, geo.width, -32768, 32767),
                y: remap(y, geo.y, geo.height, -32768, 32767),
            }
            sendHidEvent(msgStore.sockets.apiWS, { event_type: 'mouse_move', event: { to } })
            // } else if (__isRelativeCaptured()) {
            // 	__sendOrPlanRelativeMove({
            // 		"x": event.movementX,
            // 		"y": event.movementY,
            // 	});
        }
    }

    private onMouseDown(event: MouseEvent) {
    }

    private onMouseUp(event: MouseEvent) {
    }

}