// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:2500';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  VERIFY_RESET_TOKEN: `${API_BASE_URL}/auth/verify-reset-token`,
  VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
  RESEND_VERIFICATION: `${API_BASE_URL}/auth/resend-verification`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify-token`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  UPDATE_PASSWORD: `${API_BASE_URL}/auth/update-password`,
  UPDATE_ACCOUNT: `${API_BASE_URL}/auth/update-account`,
  ADMIN_REGISTER: `${API_BASE_URL}/api/v1/admin/register-admin`,
  ADMIN_LOGIN: `${API_BASE_URL}/api/v1/admin/login-admin`,
  UPDATE_AVATAR: `${API_BASE_URL}/auth/update-avatar`,


  // Issues endpoints
  ISSUES: `${API_BASE_URL}/api/issues`,
  ISSUE_BY_ID: (id) => `${API_BASE_URL}/api/issues/${id}`,
  ISSUE_UPVOTE: (id) => `${API_BASE_URL}/api/issues/${id}/upvote`,
  ISSUE_STATUS: (id) => `${API_BASE_URL}/api/issues/${id}/status`,

  // Dashboard endpoints
  DASHBOARD_STATS: `${API_BASE_URL}/api/dashboard/stats`,
  DASHBOARD_CHARTS: `${API_BASE_URL}/api/dashboard/charts`,
};

export default API_ENDPOINTS;
