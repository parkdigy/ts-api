import { Api, ApiOption, ApiError } from '@pdg/api';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface ResponseData {
  result: {
    c: number;
    m?: string;
  };
  data?: any;
}

const option: ApiOption<ResponseData> = {
  baseUrl: 'http://localhost/api/v1',
  timeParamName: '_t_',
  async onRequest(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    console.log('onRequest', config);
    return config;
  },
  async onResponse(res: AxiosResponse) {
    const responseData = res.data;
    if (!responseData || responseData.result == null) {
      throw new ApiError('예상치 못한 오류가 발생했습니다.');
    } else if (responseData.result.c !== 0) {
      throw new ApiError(responseData.result.m, `API_ERR_${responseData.result.c}`);
    }
    return responseData;
  },
  onError(err: ApiError) {
    console.log(err.message);
  },
};

const api = new Api<ResponseData>(option);
api.get('path/api').then((data) => {
  console.log(data);
});
