// Issues API Service
import { API_ENDPOINTS } from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const issuesService = {
  // Get all issues
  getAllIssues: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const url = queryParams.toString()
      ? `${API_ENDPOINTS.ISSUES}?${queryParams.toString()}`
      : API_ENDPOINTS.ISSUES;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch issues');
    }

    return response.json();
  },

  // Get issue by ID
  getIssueById: async (id) => {
    const response = await fetch(API_ENDPOINTS.ISSUE_BY_ID(id), {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch issue');
    }

    return response.json();
  },

  // Create new issue
  createIssue: async (formDataToSend) => {
    const token = localStorage.getItem("token");

    const response = await fetch(API_ENDPOINTS.ISSUES, {
      method: 'POST',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formDataToSend,   // <-- IMPORTANT: send FormData directly
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create issue');
    }

    return response.json();
  },


  // Update issue
  updateIssue: async (id, issueData) => {
    const response = await fetch(API_ENDPOINTS.ISSUE_BY_ID(id), {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(issueData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update issue');
    }

    return response.json();
  },

  // Delete issue
  deleteIssue: async (id) => {
    const response = await fetch(API_ENDPOINTS.ISSUE_BY_ID(id), {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete issue');
    }

    return response.json();
  },

  // Upvote issue
  upvoteIssue: async (id) => {
    const response = await fetch(API_ENDPOINTS.ISSUE_UPVOTE(id), {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upvote issue');
    }

    return response.json();
  },

  // Update issue status
  updateIssueStatus: async (id, status) => {
    const response = await fetch(API_ENDPOINTS.ISSUE_STATUS(id), {
      method: 'PATCH',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update issue status');
    }

    return response.json();
  },
};

export default issuesService;
