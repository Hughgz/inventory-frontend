import axios from 'axios';
import { getToken } from './authApi';

const API_URL = 'http://localhost:8080/api/import-details';

// Lấy danh sách chi tiết phiếu nhập theo mã phiếu nhập
export const getImportDetailsByReceiptId = async (importReceiptId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/receipt/${importReceiptId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`API Response - getImportDetailsByReceiptId(${importReceiptId}):`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching import details for receipt ${importReceiptId}:`, error);
    throw error;
  }
};

// Lấy chi tiết phiếu nhập theo ID của chi tiết
export const getImportDetailById = async (importDetailId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/${importDetailId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`API Response - getImportDetailById(${importDetailId}):`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching import detail with id ${importDetailId}:`, error);
    throw error;
  }
};

// Lấy danh sách chi tiết phiếu nhập kèm thông tin vật tư
export const getImportDetailsWithMaterialByReceiptId = async (importReceiptId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/receipt/${importReceiptId}/with-material`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`API Response - getImportDetailsWithMaterialByReceiptId(${importReceiptId}):`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching import details with material for receipt ${importReceiptId}:`, error);
    if (error.response?.status === 404 || !error.response) {
      console.log(`API not available, returning empty array`);
      return [];
    }
    throw error;
  }
}; 