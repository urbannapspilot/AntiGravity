// Automatic environment detection for API path
const isProd = import.meta.env.PROD || import.meta.env.VITE_ENV === 'production';
const localApi = `http://localhost:${import.meta.env.VITE_ADMIN_PORT || '3001'}`;

// Use the public API URL if provided in GitHub Secrets, else fall back to local dev server
export const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || localApi;

export const ENDPOINTS = {
    DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
    ORGANIZATIONS: `${API_BASE_URL}/api/admin/organizations`,
    PODS: `${API_BASE_URL}/api/admin/pods`,
    LOCATIONS: `${API_BASE_URL}/api/admin/locations`,
    PROMOTIONS: `${API_BASE_URL}/api/admin/promotions`,
    SESSIONS: `${API_BASE_URL}/api/admin/sessions`,
};
