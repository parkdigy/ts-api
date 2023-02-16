import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, ResponseType } from 'axios';
export interface ApiRequestData {
    [key: string]: any;
}
export interface ApiRequestOption {
    raw?: boolean;
    rawResponseType?: ResponseType;
    silent?: boolean;
}
export interface ApiRequestConfig extends AxiosRequestConfig {
    silent?: boolean;
}
export declare class ApiError<T = any> extends Error {
    code?: string;
    config?: ApiRequestConfig;
    baseUrl?: string;
    path?: string;
    requestData?: ApiRequestData;
    requestOption?: ApiRequestOption;
    response?: AxiosResponse<T>;
    status?: number;
    isAxiosError: boolean;
    constructor(message?: string, code?: string);
}
export interface ApiOption<T = any> {
    baseUrl: string;
    withCredentials?: boolean;
    headers?: AxiosRequestConfig['headers'];
    onRequest?(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig>;
    onResponse?(response: AxiosResponse<T>, config: AxiosRequestConfig, baseUrl: string, path: string, requestData?: ApiRequestData, requestOption?: ApiRequestOption): Promise<T>;
    onError?(err: ApiError): void;
    dataKeysToLowerCase?: boolean;
}
