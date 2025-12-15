import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiResponse } from '@shared/types';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response) => response,
            (error: AxiosError<ApiResponse<unknown>>) => {
                if (error.response?.status === 401) {
                    // Handle unauthorized access
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
        const response = await this.api.get<ApiResponse<T>>(url, { params });
        return response.data.data as T;
    }

    async post<T>(url: string, data?: unknown): Promise<T> {
        const response = await this.api.post<ApiResponse<T>>(url, data);
        return response.data.data as T;
    }

    async put<T>(url: string, data?: unknown): Promise<T> {
        const response = await this.api.put<ApiResponse<T>>(url, data);
        return response.data.data as T;
    }

    async delete<T>(url: string): Promise<T> {
        const response = await this.api.delete<ApiResponse<T>>(url);
        return response.data.data as T;
    }

    async patch<T>(url: string, data?: unknown): Promise<T> {
        const response = await this.api.patch<ApiResponse<T>>(url, data);
        return response.data.data as T;
    }
}

export const apiService = new ApiService();
export default apiService;
