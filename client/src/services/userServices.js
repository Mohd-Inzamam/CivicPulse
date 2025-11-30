// userServices.js
import { API_ENDPOINTS } from '../config/api'; // ASSUMPTION: You have USER related endpoints here

// Helper function to get authorization headers, matching issuesService
const getAuthHeaders = (isFormData = false) => {
    const token = localStorage.getItem('token');
    const headers = {
        // Set Content-Type only if not sending FormData
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        // Always include Authorization if token exists
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
    return headers;
};

export const userServices = {
    // Get the currently logged-in user's profile
    // Route: GET /users/me
    getProfile: async () => {
        const url = API_ENDPOINTS.USER_PROFILE; // ASSUMPTION: This is the /users/me endpoint

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user profile');
        }

        return response.json();
    },

    // Get a list of all users
    // Route: GET /users?page=1&limit=10...
    getAllUsers: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
        });

        const url = queryParams.toString()
            ? `${API_ENDPOINTS.USERS}?${queryParams.toString()}` // ASSUMPTION: API_ENDPOINTS.USERS is /users
            : API_ENDPOINTS.USERS;

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch users list');
        }

        return response.json();
    },

    // Get a specific user by ID
    // Route: GET /users/:id
    getUserById: async (id) => {
        const response = await fetch(API_ENDPOINTS.USER_BY_ID(id), { // ASSUMPTION: USER_BY_ID(id) returns /users/:id
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user details');
        }

        return response.json();
    },

    // Delete a user (Admin only)
    // Route: DELETE /users/:id
    deleteUser: async (id) => {
        const response = await fetch(API_ENDPOINTS.USER_BY_ID(id), {
            method: 'DELETE',
            headers: getAuthHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete user');
        }
        // Often delete requests return status 204 No Content, but we return JSON just in case.
        return response.json().catch(() => ({ message: "User deleted successfully" }));
    },

    // Toggle user activation status (Admin/Staff only)
    // Route: PATCH /users/:id/status
    toggleUserStatus: async (id, isActive) => {
        const response = await fetch(API_ENDPOINTS.USER_STATUS(id), { // ASSUMPTION: USER_STATUS(id) returns /users/:id/status
            method: 'PATCH',
            headers: getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify({ isActive }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update user status');
        }

        return response.json();
    },
};

export default userServices;