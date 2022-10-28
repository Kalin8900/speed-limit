import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

export const configuredAxios = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface RequestOptions extends AxiosRequestConfig {
  signal?: AbortSignal;
  locale?: string;
  headers?: Record<string, string>;
}

export type Request = <T>(method: Method, url?: string, options?: RequestOptions) => Promise<AxiosResponse<T>>;

export type RequestMethod = <T>(endpoint: string, options?: RequestOptions) => Promise<AxiosResponse<T>>;

export const request: Request = <T>(method: Method, url?: string, options?: RequestOptions) => {
  const headers = { 'Accept-Language': options?.locale ?? 'en', ...options?.headers }; // TODO: Get default locale from config

  return configuredAxios.request<T>({
    url,
    method,
    ...options,
    headers
  });
};

const get: RequestMethod = <T>(endpoint: string, options?: RequestOptions) => request<T>('GET', endpoint, options);

const post: RequestMethod = <T>(endpoint: string, options?: RequestOptions) => request<T>('POST', endpoint, options);

const patch: RequestMethod = <T>(endpoint: string, options?: RequestOptions) => request<T>('PATCH', endpoint, options);

// NOTE: Delete is a keyword so used remove instead
const remove: RequestMethod = <T>(endpoint: string, options?: RequestOptions) =>
  request<T>('DELETE', endpoint, options);

const put: RequestMethod = <T>(endpoint: string, options?: RequestOptions) => request<T>('PUT', endpoint, options);

export const http = {
  get,
  post,
  patch,
  remove,
  put
};
