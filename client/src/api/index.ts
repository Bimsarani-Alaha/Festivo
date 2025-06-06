import axios, { AxiosRequestHeaders } from "axios";

axios.interceptors.request.use(
  function (config) {
    config.baseURL = getBaseUrl();

    try {
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }
      console.log("Authorization header set");

      config.validateStatus = (status: number) => status >= 200 && status < 300;
      console.log("Validate status set");
    } catch (error) {
      console.error(
        "Error setting Authorization header or validateStatus:",
        error
      );
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

function getBaseUrl(): string {
  return import.meta.env="http://localhost:8080";
}

axios.interceptors.response.use(
  (response) => response,
  function (error) {
    return Promise.reject(error?.response ?? error);
  }
);
