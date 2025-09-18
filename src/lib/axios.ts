import axiosBase from "axios";

const axios = axiosBase.create({
  headers: {
    Authorization: import.meta.env.VITE_TOKEN!,
  },
});

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axios;
