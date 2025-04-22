import axios from 'axios';
import { getToken } from './authApi';

const API_URL = 'http://localhost:8080/api/import-receipts';

// Tạo phiếu nhập kho mới
export const createImportReceipt = async (importReceiptData, userId) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}?userId=${userId}`, importReceiptData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating import receipt:', error);
    throw error;
  }
};

// Lấy tất cả phiếu nhập kho
export const getAllImportReceipts = async () => {
  try {
    const token = getToken();
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching import receipts:', error);
    throw error;
  }
};

// Lấy phiếu nhập kho theo ID
export const getImportReceiptById = async (id) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching import receipt with id ${id}:`, error);
    throw error;
  }
};

// Tìm kiếm phiếu nhập kho theo tiêu chí
export const searchImportReceipts = async (params) => {
  try {
    const token = getToken();
    const { supplierId, warehouseId, startDate, endDate } = params;
    
    let url = `${API_URL}/search?`;
    if (supplierId) url += `supplierId=${supplierId}&`;
    if (warehouseId) url += `warehouseId=${warehouseId}&`;
    if (startDate) url += `startDate=${startDate.toISOString()}&`;
    if (endDate) url += `endDate=${endDate.toISOString()}&`;
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching import receipts:', error);
    throw error;
  }
};

// Phê duyệt phiếu nhập kho
export const approveImportReceipt = async (id, userId) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/${id}/approve?userId=${userId}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error approving import receipt with id ${id}:`, error);
    throw error;
  }
};

// Hủy phiếu nhập kho
export const cancelImportReceipt = async (id, userId, reason) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/${id}/cancel?userId=${userId}`, { reason }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error cancelling import receipt with id ${id}:`, error);
    throw error;
  }
};

// Xuất báo cáo phiếu nhập kho (PDF/Excel)
export const exportImportReceiptReport = async (params) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/report`, {
      params,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting import receipt report:', error);
    throw error;
  }
}; 