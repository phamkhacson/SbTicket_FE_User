import Axios from "axios";
import { API_ROOT } from "../utils/config";
const instance = Axios.create({
  baseURL: API_ROOT,
  // timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use((config) => {
  try {
    // let token = getToken();
    // if (token) {
    //   config.headers = {
    //     ...config.headers,
    //     Authorization: token,
    //   };
    // }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error.response.data || error.message);
  }
);

export default instance;
