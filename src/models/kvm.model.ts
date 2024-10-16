/*
 * @Author: shufei.han
 * @Date: 2024-10-15 15:04:33
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-16 09:43:46
 * @FilePath: \kvm-web-vue3\src\models\kvm.model.ts
 * @Description: 
 */
import kvmSvg from "@/assets/imgs/kvm.svg"
import terminalSvg from "@/assets/imgs/terminal.svg"

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
    KVM = "kvm"
}

/** KVM有关的基础信息 */
export interface KvmInfo {
    auth: {
        enabled: boolean;
    };
    extras: {
        [propName in KvmExtraApps]: KvmExtrasAppInfo
    },
    meta: {
        kvm: {};
        server: {
            host: string;
        };
        web: {
            hide_kvm_button: boolean;
        }
    };
}


export class ExtraKvmApp {
    constructor(public name: string, public path: string, public icon?: string, public onClick?: () => void) {
    }
}

export const KvmExtraAppsConfigMap = new Map([
    [KvmExtraApps.JANUS, new ExtraKvmApp("KVM", "/kvm", kvmSvg)],
    [KvmExtraApps.WEBTERM, new ExtraKvmApp("Terminal", "/webterm", terminalSvg)]
])