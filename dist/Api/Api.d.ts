import { Method } from 'axios';
import { ApiRequestData, ApiOption, ApiRequestOption } from './Api.types';
declare class Api<T = any> {
    option: ApiOption;
    constructor(option: ApiOption<T>);
    get(path: string, data?: ApiRequestData, option?: ApiRequestOption): Promise<T>;
    post(path: string, data?: ApiRequestData, option?: ApiRequestOption): Promise<T>;
    patch(path: string, data?: ApiRequestData, option?: ApiRequestOption): Promise<T>;
    delete(path: string, data?: ApiRequestData, option?: ApiRequestOption): Promise<T>;
    run: (method: Method, path: string, data?: ApiRequestData, option?: ApiRequestOption) => Promise<T>;
}
export default Api;
