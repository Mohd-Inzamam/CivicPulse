// Dashboard API Service
import { API_ENDPOINTS } from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await fetch(API_ENDPOINTS.DASHBOARD_STATS, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    
    return response.json();
  },

  // Get dashboard charts data
  getCharts: async () => {
    const response = await fetch(API_ENDPOINTS.DASHBOARD_CHARTS, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard charts');
    }
    
    return response.json();
  },
};

export default dashboardService;
