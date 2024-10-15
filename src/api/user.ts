/*
 * @Author: shufei.han
 * @Date: 2024-10-15 11:37:58
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-15 11:46:21
 * @FilePath: \kvm-web-vue3\src\api\user.ts
 * @Description: 
 */
import type { LoginParams } from "@/models/user.model";
import httpService from "./axios";

export const userService = {
  login(param: LoginParams) {
    return httpService.post("/api/auth/login", param, {formData: true});
  }
};