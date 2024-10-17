/*
 * @Author: shufei.han
 * @Date: 2024-10-15 15:04:33
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-16 15:48:19
 * @FilePath: \kvm-web-vue3\src\models\kvm.model.ts
 * @Description:
 */
import kvmSvg from "@/assets/imgs/kvm.svg";
import terminalSvg from "@/assets/imgs/terminal.svg";
import { browserTool } from "./tools";

export enum VideoStreamEnum {
    MJPEG,
    WEBRTC
}

export interface KvmExtrasAppInfo {
    daemon: string;
    description: string;
    enabled: boolean;
    icon: string;
    name: string;
    path: string;
    place: number;
    port: number;
    started: boolean;
}

export enum KvmExtraApps {
    // IPMI = "ipmi",
    JANUS = "janus",
    // JANUS_STATIC = "janus_static",
    // VNC = "vnc",
    WEBTERM = "webterm",
    KVM = "kvm",
}

/** KVM有关的基础信息 */
export interface KvmInfo {
    auth: {
        enabled: boolean;
    };
    extras: {
        [propName in KvmExtraApps]: KvmExtrasAppInfo;
    };
    meta: {
        kvm: {};
        server: {
            host: string;
        };
        web: {
            hide_kvm_button: boolean;
        };
    };
}

export class ExtraKvmApp {
    constructor(
        public name: string,
        public path: string,
        public icon?: string,
        public onClick?: () => void
    ) { }
}

export const KvmExtraAppsConfigMap = new Map([
    [KvmExtraApps.JANUS, new ExtraKvmApp("KVM", "/kvm", kvmSvg)],
    [KvmExtraApps.WEBTERM, new ExtraKvmApp("Terminal", "/webterm", terminalSvg)],
]);

export enum WsEventType {
    PONG = "pong",
    INFO_META_STATE = "info_meta_state",
    INFO_HW_STATE = "info_hw_state",
    INFO_FAN_STATE = "info_fan_state",
    INFO_SYSTEM_STATE = "info_system_state",
    INFO_EXTRAS_STATE = "info_extras_state",
    GPIO_MODEL_STATE = "gpio_model_state",
    GPIO_STATE = "gpio_state",
    HID_KEYMAPS_STATE = "hid_keymaps_state",
    HID_STATE = "hid_state",
    ATX_STATE = "atx_state",
    MSD_STATE = "msd_state",
    STREAMER_STATE = "streamer_state",
    STREAMER_OCR_STATE = "streamer_ocr_state",
}

export interface StreamStateEventInfo {
    limits: {
        desired_fps: { min: 0; max: 70 };
        h264_bitrate: { min: 25; max: 20000 };
        h264_gop: { min: 0; max: 60 };
    };
    params: { desired_fps: 40; quality: 80; h264_bitrate: 5000; h264_gop: 30 };
    snapshot: { saved: null };
    streamer: {
        instance_id: "";
        encoder: { type: "M2M-IMAGE"; quality: 80 };
        h264: { bitrate: 5000; gop: 30; online: true; fps: 25 };
        sinks: { jpeg: { has_clients: false }; h264: { has_clients: true } };
        source: {
            resolution: { width: 1920; height: 1080 };
            online: true;
            desired_fps: 40;
            captured_fps: 50;
        };
        stream: { queued_fps: 0; clients: 0; clients_stat: {} };
    };
    features: { quality: true; resolution: false; h264: true };
}

export interface WsMessage<T = any> {
    event_type: WsEventType;
    event: T;
}

export function makeMjpegStreamId() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let count = 0; count < 16; ++count) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

/**
 * @description 生成MJPEG流的URL
 */
export function generateMjpegUrl() {
    let path = `/streamer/stream?key=${makeMjpegStreamId()}`;
    if (browserTool.is_safari || browserTool.is_ios) {
        // uStreamer fix for WebKit
        console.log("Using dual_final_frames=1 to fix WebKit bugs");
        path += "&dual_final_frames=1";
    } else if (browserTool.is_chrome || browserTool.is_blink) {
        // uStreamer fix for Blink https://bugs.chromium.org/p/chromium/issues/detail?id=527446
        console.log("Using advance_headers=1 to fix Blink bugs");
        path += "&advance_headers=1";
    }
    return path
}