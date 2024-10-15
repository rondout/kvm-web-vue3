export interface BaseResponse<T = any> {
    ok: boolean;
    result: T;
}