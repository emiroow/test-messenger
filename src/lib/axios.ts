import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios, { AxiosError } from "axios";
import { API_CONFIG } from "../config/api.config";

// Create axios instance
export const apiClient = axios.create(API_CONFIG);

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token from localStorage
    const userId = localStorage.getItem("userId");
    if (userId && config.headers) {
      config.headers["X-User-Id"] = userId;
    }

    // Add timestamp
    config.headers["X-Request-Time"] = new Date().toISOString();

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `[API Response] ${response.config.method?.toUpperCase()} ${
        response.config.url
      } - ${response.status}`
    );
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error
      const status = error.response.status;

      switch (status) {
        case 401:
          console.error("[API] Unauthorized - Redirecting to login");
          localStorage.removeItem("userId");
          window.location.href = "/login";
          break;
        case 403:
          console.error("[API] Forbidden");
          break;
        case 404:
          console.error("[API] Not Found");
          break;
        case 500:
          console.error("[API] Internal Server Error");
          break;
        default:
          console.error(`[API Error] ${status}:`, error.response.data);
      }
    } else if (error.request) {
      // Request made but no response
      console.error("[API] No response received:", error.message);
    } else {
      // Error in request setup
      console.error("[API] Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const api = {
  get: <T = any>(url: string, config?: any) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T = any>(url: string, data?: any, config?: any) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T = any>(url: string, data?: any, config?: any) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T = any>(url: string, data?: any, config?: any) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T = any>(url: string, config?: any) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

export default apiClient;
