/*
 * @Author: shufei.han
 * @Date: 2024-10-15 15:01:30
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-26 12:11:30
 * @FilePath: \kvm-web-vue3\src\api\main.ts
 * @Description: 
 */
import httpService from "./axios"

export const mainService = {
    loadKvmInfo(params: { fields: 'auth,meta,extras' } | null = null) {
        return httpService.get("/api/info", { params });
    },
    updateH264Args(params: { h264_bitrate?: number, h264_gop?: number }) {
        return httpService.post("/api/streamer/set_params", null, { params });
    }
}