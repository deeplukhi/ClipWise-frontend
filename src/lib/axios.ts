import axios from 'axios';
import { toast } from 'sonner';
import { getDeviceId } from './device-id';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  config.headers['x-device-id'] = getDeviceId();
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error?.message || 'Something went wrong';
    toast.error(message);
    return Promise.reject(error);
  },
);

export default api;
