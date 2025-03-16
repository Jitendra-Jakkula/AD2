import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, logout the user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username: string, password: string) => {
    return api.post('/auth/signin', { username, password });
  },
  register: (username: string, email: string, password: string, firstName: string, lastName: string) => {
    return api.post('/auth/signup', { username, email, password, firstName, lastName });
  },
};

// Resume API
export const resumeAPI = {
  getAllResumes: () => {
    return api.get('/resumes');
  },
  getResumeById: (id: number) => {
    return api.get(`/resumes/${id}`);
  },
  createResume: (resumeData: any) => {
    return api.post('/resumes', resumeData);
  },
  updateResume: (id: number, resumeData: any) => {
    return api.put(`/resumes/${id}`, resumeData);
  },
  deleteResume: (id: number) => {
    return api.delete(`/resumes/${id}`);
  },
};

export default api; 