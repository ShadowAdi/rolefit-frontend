import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

export const axiosInstance=axios.create({
    baseURL: BASE_URL,
})

axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window === "undefined") return config;
        if (config.headers?.Authorization) return config;
        const token = localStorage.getItem('authToken');
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
    (response) => response,
    (error) => {
        if (typeof window !== "undefined" && error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('auth_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;