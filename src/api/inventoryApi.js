import axios from 'axios';

const API_URL = 'http://localhost:8080/api/inventory';

/**
 * Get inventory summary between two dates
 * @param {Date} startDate - The start date for the inventory summary
 * @param {Date} endDate - The end date for the inventory summary
 * @returns {Promise} - A promise that resolves with the inventory summary data
 */
export const getInventorySummary = async (startDate, endDate) => {
  try {
    // Convert dates to ISO format required by the API
    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = endDate.toISOString();
    
    const response = await axios.get(`${API_URL}/summary`, {
      params: {
        startDate: formattedStartDate,
        endDate: formattedEndDate
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory summary:', error);
    throw error;
  }
}; 