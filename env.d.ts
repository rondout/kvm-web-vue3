/// <reference types="vite/client" />
import 'ant-design-vue/typings/global'


declare global {
    const log: Console['log']
    interface Window {
        log: Console['log']
    }
    interface WebSocket {
        sendHidedEvent: (event: any) => void
    }

    type MediaProvider = MediaStream & MediaSource & Blob;

    interface HTMLMediaElement {
        srcObject: MediaProvider;
    }

}
