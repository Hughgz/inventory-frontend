import axios from 'axios';
import { getToken } from './authApi';

const API_URL = 'http://localhost:8080/api/customers';

// Helper function to get headers with auth token
const getAuthHeaders = () => {
  const token = getToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

// Get all customers
export const getAllCustomers = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAll`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get customer by ID
export const getCustomerById = async (customerId) => {
  try {
    const response = await axios.get(`${API_URL}/getById/${customerId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new customer
export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, customerData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update customer
export const updateCustomer = async (customerId, customerData) => {
  try {
    const response = await axios.post(`${API_URL}/update/${customerId}`, customerData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Toggle customer status
export const updateCustomerStatus = async (customerId, isActive) => {
  try {
    const response = await axios.post(`${API_URL}/status/${customerId}/${isActive}`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
}; 