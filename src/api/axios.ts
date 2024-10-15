/*
 * @Description: http请求封装
 * @Author: shufei.han
 * @LastEditors: shufei.han
 * @Date: 2024-05-13 10:24:40
 * @LastEditTime: 2024-10-15 12:06:01
 */
import { BaseResponse } from "@/models/request.model";
import axios, {
    AxiosInstance,
    AxiosResponse,
    CreateAxiosDefaults,
    InternalAxiosRequestConfig,
    type AxiosRequestConfig,
} from "axios";

declare module "axios" {
    interface AxiosRequestConfig {
        /** 是否需要将data转化为formData的格式 */
        formData?: boolean;
        /** 是否需要设置apiPrefix */
        apiPrefix?: string;
    }
    interface AxiosResponse<T> {
        info?: T;
    }
}

/**
 * @description 发送http请求的类
 * @member {AxiosInstance} instance axios实例
 */
export class HttpService {
    /**
     * @description axios实例
     */
    public instance: AxiosInstance = null;

    /**
     * 
     * @param config 基础配置，包括timeout之类的
     * @param configRequest 请求拦截器，这里已经对formData这个配置属性做了统一处理，业务端不需要再做处理
     * @param configResponse 相应拦截器，需要直接返回整个response
     * @param errorHandler 错误处理
     */
    constructor(
        private config: CreateAxiosDefaults = { timeout: 30000 },
        private configRequest: <T = any>(config: InternalAxiosRequestConfig<T>) => void,
        private configResponse: (value: AxiosResponse<any, any>) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>,
        private errorHandler?: ((error: any) => any) | null
    ) {
        this.init();
    }

    /**
     * @description 初始化实例
     */
    private init() {
        // apiPrefix需要在调用的时候决定是否加入
        this.instance = axios.create({ ...this.config, apiPrefix: undefined });
        this.instance.interceptors.request.use(
            (config) => {
                // 这里处理formData 其他的交给业务自己处理
                if (config.formData) {
                    const formData = new FormData();
                    Object.keys(config.data).forEach((k) => {
                        formData.append(k, config.data[k]);
                    });
                    config.data = formData;
                }

                // 这里只做formData处理，剩余的各自业务自己处理
                this.configRequest(config);

                return config;
            },
            (error) => {
                Promise.reject(error);
            }
        );

        this.instance.interceptors.response.use(
            (response) => {
                console.log(response);
                return this.configResponse(response);
            },

            (error) => {
                console.log(error);
                return this.errorHandler?.(error)
            }
        );
    }
    /**
     * @description 可以进行任意类型的请求，返回值直接去掉了data这一层，直接返回{info: xxxx}这样的数据格式,即Promise<BaseResponse<T>>
     * @returns 
     */
    public request = async <T = any, D = any>(config: AxiosRequestConfig<D>): Promise<BaseResponse<T>> => {
        const result = await this.instance.request(config);
        return result.data as any as BaseResponse<T>;
    }
    /**
    * @description 兼容goodcloud 因为其没有处理data这一层级，返回的数据格式为Promise<{data: BaseResponse}>
    * @returns 
    */
    public requestWithData = async <T = any, D = any>(config: AxiosRequestConfig<D>) => {
        const result = await this.instance.request(config);
        return result as any as { data: BaseResponse<T> };
    }
    /**
    * @template T 响应数据的数据类型
    * @template D 请求体data的数据类型
    * @description 用于发送get请求，这个方法直接将res.data.info字段的数据返回
    * @returns 
    */
    public get = async <T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) => {
        const result = await this.instance.get<T, AxiosResponse<{ info: T }>>(url, config);
        return result as T
    }
    /**
    * @template T 响应数据的数据类型
    * @template D 请求体data的数据类型
    * @description 用于发送post请求，这个方法直接将res.data.info字段的数据返回
    * @returns 
    */
    public post = async <T = any, D = any>(url: string, data?: D,
        config?: AxiosRequestConfig<D>) => {
        const result = await this.instance.post<T, AxiosResponse<{ info: T }>>(url, data, config);
        return result as T;
    }
    /**
    * @template T 响应数据的数据类型
    * @template D 请求体data的数据类型
    * @description 用于发送put请求，这个方法直接将res.data.info字段的数据返回
    * @returns 
    */
    public put = async <T = any, D = any>(url: string, data?: D,
        config?: AxiosRequestConfig<D>) => {
        const result = await this.instance.put<T, AxiosResponse<{ info: T }>>(url, data, config);
        return result as T;
    }
    /**
    * @template T 响应数据的数据类型
    * @template D 请求体data的数据类型
    * @description 用于发送delete请求，这个方法直接将res.data.info字段的数据返回
    * @returns 
    */
    public delete = async <T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) => {
        const result = await this.instance.delete<T, AxiosResponse<{ info: T }>>(url, config);
        return result as T;
    }
}

const httpService = new HttpService({ timeout: 30000 }, () => { }, (response) => {
    return response.data.result
}, err => {
    return Promise.reject(err?.response?.data?.result)
})

export default httpService

