import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { StatusCodes } from 'http-status-codes';

const BACKEND_URL = <string>import.meta.env.VITE_WEATHER_SERVER;
const REQUEST_TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  // api.interceptors.request.use(
  //   (config: InternalAxiosRequestConfig) => {
  //     const token = getToken();

  //     if (token && config.headers) {
  //       config.headers['x-token'] = token;
  //     }

  //     return config;
  //   },
  // );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ error: string }>) => {
      if (error.response?.status === StatusCodes.NOT_FOUND) {
        //todo to not found
        //browserHistory.push(AppRoute.PageNotFound)
      }
      throw error;
    }
  );

  return api;
};
