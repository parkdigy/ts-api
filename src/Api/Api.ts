import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, Method } from 'axios';
import { ApiError, ApiRequestData, ApiOption, ApiRequestOption, ApiRequestConfig } from './Api.types';
import { notEmpty, joinUrl } from '../@util';

class Api<T = any> {
  option: ApiOption;

  // constructor -------------------------------------------------------------------------------------------------------

  constructor(option: ApiOption<T>) {
    this.option = option;
  }

  get(path: string, data?: ApiRequestData, option?: ApiRequestOption): Promise<T> {
    return this.run('get', path, data, option);
  }

  post(path: string, data?: ApiRequestData, option?: ApiRequestOption): Promise<T> {
    return this.run('post', path, data, option);
  }

  patch(path: string, data?: ApiRequestData, option?: ApiRequestOption): Promise<T> {
    return this.run('patch', path, data, option);
  }

  delete(path: string, data?: ApiRequestData, option?: ApiRequestOption): Promise<T> {
    return this.run('delete', path, data, option);
  }

  // Run ---------------------------------------------------------------------------------------------------------------

  run = (method: Method, path: string, data?: ApiRequestData, option?: ApiRequestOption): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const headers: ApiRequestConfig['headers'] = { ...this.option.headers };

      if (typeof window !== 'undefined') {
        if (window?.location?.href) {
          headers['X-Referer'] = window.location.href;
        }
      }

      const requestConfig: ApiRequestConfig = {
        method,
        withCredentials: this.option.withCredentials,
        headers,
        silent: !!option?.silent,
      };
      if (option?.raw) {
        requestConfig.responseType = option?.rawResponseType || 'arraybuffer';
      }

      requestConfig.url = joinUrl(this.option.baseUrl, path.replace(/\./g, '/'));

      if (data) {
        if (method === 'get') {
          if (notEmpty(data)) {
            const finalData: ApiRequestData = {};
            for (const key in data) {
              if (data[key] != null) {
                finalData[key] = data[key];
              }
            }
            requestConfig.url += `?${new URLSearchParams(finalData).toString()}`;
          }
        } else {
          requestConfig.data = data;
        }
      }

      const setErrorInfo = (err: ApiError, status?: number, response?: AxiosResponse) => {
        err.config = requestConfig;
        err.baseUrl = this.option.baseUrl;
        err.path = path;
        err.requestData = data;
        err.requestOption = option;
        err.response = response;
        err.status = status;
      };

      const fireError = (err: any): void => {
        const apiError: ApiError = new ApiError();

        if (typeof err === 'object') {
          apiError.message = err.message;
          apiError.code = err.code;
          setErrorInfo(apiError, err.status, err.response);
        } else if (typeof err === 'string') {
          apiError.message = err;
        } else if (err) {
          apiError.message = err.toString();
        }

        if (this.option.onError) this.option.onError(apiError);

        reject(apiError);
      };

      const instance: AxiosInstance = require('axios').default.create();
      let requestInterceptor: number;
      if (this.option.onRequest) {
        requestInterceptor = instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
          if (this.option.onRequest) {
            return this.option.onRequest(config, this.option.baseUrl, path, data, option);
          } else {
            return config;
          }
        });
      }

      instance
        .request<T>(requestConfig)
        .then((res) => {
          const { data: resData } = res;
          if (this.option.onResponse) {
            this.option
              .onResponse(res, requestConfig, this.option.baseUrl, path, data, option)
              .then((finalResData) => {
                resolve(finalResData);
              })
              .catch((err: ApiError) => {
                setErrorInfo(err, res.status, res);
                fireError(err);
              });
          } else {
            resolve(resData);
          }
        })
        .catch(fireError)
        .finally(() => {
          if (requestInterceptor) {
            instance.interceptors.request.eject(requestInterceptor);
          }
        });
    });
  };
}

export default Api;
