/**
 * Configures an Axios instance with a base URL and authorization headers.
 * The instance also includes interceptors to handle request and response processing.
 * - The request interceptor adds the authorization token from localStorage to the request headers.
 * - The response interceptor checks if the response contains a `newNotifications` property and updates the `notifications` item in localStorage accordingly.
 */
import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || null}`,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.newNotifications) {
      console.log("true");
      localStorage.setItem("notifications", "true");
    } else {
      localStorage.setItem("notifications", "false");
    }
    return response;
  },
  (error: any) => {
    console.log("Error:", error);
    return Promise.reject(error);
  }
);
