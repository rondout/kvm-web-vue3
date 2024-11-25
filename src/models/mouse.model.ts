/*
 * @Author: shufei.han
 * @Date: 2024-11-22 16:32:08
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-25 10:33:34
 * @FilePath: \kvm-web-vue3\src\models\mouse.model.ts
 * @Description: 
 */
import { useMsgStore } from "@/stores/message";
import { getGeometry, remap, sendHidEvent } from "./session.model";
import { browser } from "@/utils";

const msgStore = useMsgStore()

export enum MouseButton {
    left = 0,
    middle = 1,
    right = 2,
    up = 3,
    down = 4,
}

export enum MouseEventType {
    MOUSE_BUTTON = 'mouse_button',
    MOUSE_MOVE = 'mouse_move',
    MOUSE_WHEEL = 'mouse_wheel'
}

export interface KvmMouseEvent<T = any> {
    event_type: MouseEventType;
    event: T
}

export const MouseButtonMap = new Map([
    [MouseButton.left, 'left'],
    [MouseButton.middle, 'middle'],
    [MouseButton.right, 'right'],
    [MouseButton.up, 'up'],
    [MouseButton.down, 'down'],
])

export class MouseEventHandler {
    public absolute = true
    public planned_pos = { "x": 0, "y": 0 };
    public scroll_delta = { "x": 0, "y": 0 };
    /** 鼠标是否hover在视频上面 */
    public streamHovered = false
    /** 鼠标是否hover在视频上面 */


    constructor(private el: HTMLElement, private settings = { scroll_rate: 5 } as any) {
        this.bindEvents()
    }

    private bindEvents() {
        this.el.addEventListener('wheel', e => this.onMouseWheelScroll(e))
        this.el.addEventListener('mouseenter', e => this.onMouseLeaveOrEnter(e, true))
        this.el.addEventListener('mouseleave', e => this.onMouseLeaveOrEnter(e, false))
        this.el.addEventListener('mousemove', e => this.onMouseMove(e))
        this.el.addEventListener('mousedown', e => this.onMouseDown(e))
        this.el.addEventListener('mouseup', e => this.onMouseUp(e))
        this.el.addEventListener('contextmenu', e => e.preventDefault())
    }

    private onMouseLeaveOrEnter(event: MouseEvent, enter: boolean) {
        this.streamHovered = enter
        if (enter) {
            this.absolute = true
        } else {
            this.absolute = false
        }
    }

    private onMouseWheelScroll(event: WheelEvent) {
        event.preventDefault()
        let delta = { "x": 0, "y": 0 };
        // if ($("hid-mouse-cumulative-scrolling-switch").checked) {
        if (this.settings.cumulative_scrolling) {
            let factor = (browser.is_mac ? 5 : 1);

            this.scroll_delta.x += event.deltaX * factor; // Horizontal scrolling
            if (Math.abs(this.scroll_delta.x) >= 100) {
                delta.x = this.scroll_delta.x / Math.abs(this.scroll_delta.x) * (-this.settings.scroll_rate);
                this.scroll_delta.x = 0;
            }

            this.scroll_delta.y += event.deltaY * factor; // Vertical scrolling
            if (Math.abs(this.scroll_delta.y) >= 100) {
                delta.y = this.scroll_delta.y / Math.abs(this.scroll_delta.y) * (-this.settings.scroll_rate);
                this.scroll_delta.y = 0;
            }
        } else {
            if (event.deltaX !== 0) {
                delta.x = event.deltaX / Math.abs(event.deltaX) * (-this.settings.scroll_rate);
            }
            if (event.deltaY !== 0) {
                delta.y = event.deltaY / Math.abs(event.deltaY) * (-this.settings.scroll_rate);
            }
        }

        this.sendScroll(delta);
    }

    private onMouseMove(event: MouseEvent) {
        if (this.absolute) {
            // @ts-ignore
            let rect = event.target.getBoundingClientRect();
            this.planned_pos = {
                "x": Math.max(Math.round(event.clientX - rect.left), 0),
                "y": Math.max(Math.round(event.clientY - rect.top), 0),
            };
            const { x, y } = this.planned_pos;
            let geo = getGeometry()
            let to = {
                x: remap(x, geo.x, geo.width, -32768, 32767),
                y: remap(y, geo.y, geo.height, -32768, 32767),
            }
            this.sendEvent({ event_type: MouseEventType.MOUSE_MOVE, event: { to } })
            // } else if (__isRelativeCaptured()) {
            // 	__sendOrPlanRelativeMove({
            // 		"x": event.movementX,
            // 		"y": event.movementY,
            // 	});
        }
    }

    private onMouseDown(event: MouseEvent) {
        const params = { event_type: MouseEventType.MOUSE_BUTTON, event: { button: MouseButtonMap.get(event.button), state: true } }
        sendHidEvent(msgStore.sockets.apiWS, params)
    }

    private onMouseUp(event: MouseEvent) {
        const params = { event_type: MouseEventType.MOUSE_BUTTON, event: { button: MouseButtonMap.get(event.button), state: false } }
        sendHidEvent(msgStore.sockets.apiWS, params)
    }

    private sendScroll(delta) {
        if (delta.x || delta.y) {
            // 这里应该是判断是否有scroll reverse相关的设置
            // if ($("hid-mouse-reverse-scrolling-switch").checked) {
            // 	delta.y *= -1;
            // }
            // if ($("hid-mouse-reverse-panning-switch").checked) {
            // 	delta.x *= -1;
            // }
            this.sendEvent({ event_type: MouseEventType.MOUSE_WHEEL, event: { delta } })
        }
    }

    private sendEvent<T>(data: KvmMouseEvent<T>) {
        sendHidEvent(msgStore.sockets.apiWS, data)
    }
}