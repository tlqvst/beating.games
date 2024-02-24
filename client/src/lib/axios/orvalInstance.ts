import Axios, { AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

// add a second `options` argument here if you want to pass extra options to each generated query
export const orvalInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    withCredentials: true,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error Required
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};
