/*
 * @Author: shufei.han
 * @Date: 2024-10-15 15:01:30
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-15 16:30:33
 * @FilePath: \kvm-web-vue3\src\api\main.ts
 * @Description: 
 */
import httpService from "./axios"

export const mainService = {
    loadKvmInfo(params: { fields: 'auth,meta,extras' } | null = null) {
        return httpService.get("/api/info", { params });
    }
}