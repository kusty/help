import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * @export
 * @param {*} options
 * @returns
 */

export async function request(options: AxiosRequestConfig) {

  const { url, data, method = 'get', auth } = options;
  return axios({
    url,
    method,
    data,
    auth,
  }).then(async (res: AxiosResponse) => {

    if (res.status !== 200) {
      return Promise.reject(res.data);
    }
    return res.data;
  }).catch((err: AxiosError) => {

    return Promise.reject({ ...err.response });
  });
}
