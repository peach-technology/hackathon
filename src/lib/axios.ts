import axiosBase from "axios";

const axios = axiosBase.create({
  headers: {
    Authorization: import.meta.env.VITE_TOKEN!,
  },
  baseURL:
    process.env.NODE_ENV === "production" ? "https://huam.fly.dev" : "/api",
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
