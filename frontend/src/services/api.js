import axios from 'axios';

// Backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.message);
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/profile')
};

// Problems API
export const problemsAPI = {
    getAll: (params) => api.get('/problems', { params }),
    getById: (id) => api.get(`/problems/${id}`),
    create: (data) => api.post('/problems', data)
};

// Submissions API
export const submissionsAPI = {
    submit: (data) => api.post('/submissions', data),
    getAll: () => api.get('/submissions'),
    getById: (id) => api.get(`/submissions/${id}`)
};

// CONTESTS API
export const contestsAPI = {
    getAll: () => api.get('/contests'),
    getRunning: () => api.get('/contests/running'),
    getUpcoming: (hours) => api.get('/contests/upcoming', { params: { hours } }),
    getByPlatform: (platform) => api.get(`/contests/platform/${platform}`)
};

export default api;