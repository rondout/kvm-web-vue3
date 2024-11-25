/*
 * @Author: shufei.han
 * @Date: 2024-11-25 15:29:30
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-25 15:34:59
 * @FilePath: \kvm-web-vue3\src\models\state.model.ts
 * @Description: 
 */
import { WsEventType } from "./kvm.model";

export interface BaseEventState<T> {
    event_type: WsEventType;
    event: T;
}


export interface HidEventState {
    online: boolean;
    busy: boolean;
    connected: null;
    keyboard: {
        online: boolean;
        leds: { caps: boolean; scroll: boolean; num: boolean };
        outputs: { available: []; active: string };
    };
    mouse: {
        outputs: { available: []; active: string };
        online: boolean;
        absolute: boolean;
    };
    jiggler: { enabled: boolean; active: boolean; interval: number };
}

export interface StreamEventState {
    limits: {
        desired_fps: { min: number; max: number };
        h264_bitrate: { min: number; max: number };
        h264_gop: { min: number; max: number };
    };
    params: { desired_fps: number; quality: number; h264_bitrate: number; h264_gop: number };
    snapshot: { saved: null };
    streamer: {
        instance_id: "";
        encoder: { type: "M2M-IMAGE"; quality: number };
        h264: { bitrate: number; gop: number; online: boolean; fps: number };
        sinks: { jpeg: { has_clients: false }; h264: { has_clients: boolean } };
        source: {
            resolution: { width: number; height: number };
            online: boolean;
            desired_fps: number;
            captured_fps: number;
        };
        stream: { queued_fps: number; clients: number; clients_stat: {} };
    };
    features: { quality: boolean; resolution: false; h264: boolean };
}