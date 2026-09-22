import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`,
  timeout: 30000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isSessionProbe = requestUrl.includes('/auth/me');
    const isAuthPage = /^\/(login|signup)$/.test(window.location.pathname);

    if (error.response?.status === 401 && !isSessionProbe) {
      window.dispatchEvent(new Event('auth:expired'));

      if (!isAuthPage) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
