import axios, { AxiosRequestConfig } from 'axios'

axios.defaults.timeout = 1000 * 10

interface AxiosErrorInterface {
  message: string;
  config: any;
  response: any;
}

axios.interceptors.request.use((config: any) => {
  return config;
}, (error: AxiosErrorInterface) => {
  return Promise.reject(error);
});

axios.interceptors.response.use((response: any) => {
  return response;
}, (error: AxiosErrorInterface) => {
  return Promise.reject(error);
});

const baseRequest = (config: any) => {
  return axios.request(config)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.debug('axios error: ', error.message)
      return Promise.reject(error)
    })
}

export default {
  get(url: string, params?: object, config?: AxiosRequestConfig) {
    return baseRequest({
      method: 'get',
      params,
      url,
      ...config
    })
  },
  post(url: string, data: object, config?: AxiosRequestConfig) {
    return baseRequest({
      data,
      method: 'post',
      url,
      ...config
    })
  },
  patch(url: string, data: object, config?: AxiosRequestConfig) {
    return baseRequest({
      data,
      method: 'patch',
      url,
      ...config
    })
  },
  put(url: string, data?: object, config?: AxiosRequestConfig) {
    return baseRequest({
      data,
      method: 'put',
      url,
      ...config
    })
  },
  delete(url: string, data?: object, config?: AxiosRequestConfig) {
    return baseRequest({
      data,
      method: 'delete',
      url,
      ...config
    })
  }
}
