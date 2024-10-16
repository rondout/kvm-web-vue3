/*
 * @Author: shufei.han
 * @Date: 2024-10-15 18:28:01
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-15 18:37:37
 * @FilePath: \kvm-web-vue3\src\api\error.ts
 * @Description: 
 */
import router from "@/router";
import { message } from "ant-design-vue";
import { AxiosError } from "axios";

export enum ErrorCode {
    UNKNOWN = 0,
    NOT_FOUND = 404,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    BAD_REQUEST = 400,
    SERVER_ERROR = 500
}

export function handleResponseError(error: AxiosError) {
    if ([ErrorCode.FORBIDDEN, ErrorCode.UNAUTHORIZED].includes(error.status)) {
        message.error("Please login first!")
        router.push("/login")
    }
}