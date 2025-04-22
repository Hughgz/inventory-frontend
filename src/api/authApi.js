import axios from 'axios';

const API_URL = 'http://localhost:8080/api/user';

// Login user
export const login = async (phoneNumber, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      phone_number: phoneNumber,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Register user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

// Check if user is logged in
export const isLoggedIn = () => {
  const user = getCurrentUser();
  return !!user && !!user.token;
};

// Get auth token
export const getToken = () => {
  const user = getCurrentUser();
  return user?.token;
};

// Setup axios interceptor to add token to requests
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}; 