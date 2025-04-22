import axios from 'axios';
import { getToken } from './authApi';

const API_URL = 'http://localhost:8080/api/export-receipts';

// Tạo phiếu xuất kho mới
export const createExportReceipt = async (exportReceiptData, userId) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/create?userId=${userId}`, exportReceiptData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating export receipt:', error);
    throw error;
  }
};

// Lấy tất cả phiếu xuất kho
export const getAllExportReceipts = async () => {
  try {
    const token = getToken();
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('API Response - getAllExportReceipts:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching export receipts:', error);
    // Nếu API chưa sẵn sàng, trả về mảng rỗng
    if (error.response?.status === 404 || !error.response) {
      console.log('API not available, returning empty array');
      return [];
    }
    throw error;
  }
};

// Lấy phiếu xuất kho theo ID
export const getExportReceiptById = async (id) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`API Response - getExportReceiptById(${id}):`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching export receipt with id ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy phiếu xuất kho với mã này');
    } else if (!error.response) {
      throw new Error('Không thể kết nối đến máy chủ');
    } else {
      throw error;
    }
  }
};

// Tìm kiếm phiếu xuất kho theo tiêu chí
export const searchExportReceipts = async (params) => {
  try {
    const token = getToken();
    const { customerId, warehouseId, startDate, endDate } = params;
    
    let url = `${API_URL}/search?`;
    if (customerId) url += `customerId=${customerId}&`;
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
    console.error('Error searching export receipts:', error);
    throw error;
  }
};

// Phê duyệt phiếu xuất kho
export const approveExportReceipt = async (id, userId) => {
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
    console.error(`Error approving export receipt with id ${id}:`, error);
    throw error;
  }
};

// Hủy phiếu xuất kho
export const cancelExportReceipt = async (id, userId, reason) => {
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
    console.error(`Error cancelling export receipt with id ${id}:`, error);
    throw error;
  }
};

// Xuất báo cáo phiếu xuất kho (PDF/Excel)
export const exportExportReceiptReport = async (params) => {
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
    console.error('Error exporting export receipt report:', error);
    throw error;
  }
};

// Lấy phiếu xuất kho theo trạng thái
export const getExportReceiptsByStatus = async (status) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/status/${status}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`API Response - getExportReceiptsByStatus(${status}):`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching export receipts with status ${status}:`, error);
    // Nếu API chưa sẵn sàng, trả về mảng rỗng
    if (error.response?.status === 404 || !error.response) {
      console.log(`API not available, returning empty array for status: ${status}`);
      return [];
    }
    throw error;
  }
}; 