import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_VERSION,
});

const setupAxiosInterceptors = () => {


  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

      }
      return Promise.reject(error);
    }
  );
};

setupAxiosInterceptors();

export default api;
