/// <reference types="vite/client" />
import 'ant-design-vue/typings/global'


declare global {
    const log: Console['log']
    interface Window {
        log: Console['log']
    }
}