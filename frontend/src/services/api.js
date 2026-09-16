/**
 * API Service Layer (Member 4 Integration)
 *
 * Centralized service for communication between React UI and FastAPI backend.
 * Connects to live FastAPI backend at http://localhost:8000.
 * Automatically falls back to mockApi.js if the backend is unreachable.
 */

import axios from 'axios';
import * as mockApi from './mockApi';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

export const USE_REAL_API = true;

export async function getMetrics() {
  if (!USE_REAL_API) return mockApi.getMetrics();
  try {
    const { data } = await apiClient.get('/api/metrics');
    return data;
  } catch (err) {
    console.warn('[API] /api/metrics failed, falling back to mock data:', err.message);
    return mockApi.getMetrics();
  }
}

export async function getTechnicalDebt() {
  if (!USE_REAL_API) return mockApi.getTechnicalDebt();
  try {
    const { data } = await apiClient.get('/api/technical-debt');
    return data;
  } catch (err) {
    console.warn('[API] /api/technical-debt failed, falling back to mock data:', err.message);
    return mockApi.getTechnicalDebt();
  }
}

export async function getPredictions() {
  if (!USE_REAL_API) return mockApi.getPredictions();
  try {
    const { data } = await apiClient.get('/api/predictions');
    return data;
  } catch (err) {
    console.warn('[API] /api/predictions failed, falling back to mock data:', err.message);
    return mockApi.getPredictions();
  }
}

export async function getHotspots() {
  if (!USE_REAL_API) return mockApi.getHotspots();
  try {
    const { data } = await apiClient.get('/api/hotspots');
    return data;
  } catch (err) {
    console.warn('[API] /api/hotspots failed, falling back to mock data:', err.message);
    return mockApi.getHotspots();
  }
}

export async function getPriorities() {
  if (!USE_REAL_API) return mockApi.getPriorities();
  try {
    const { data } = await apiClient.get('/api/priorities');
    return data;
  } catch (err) {
    console.warn('[API] /api/priorities failed, falling back to mock data:', err.message);
    return mockApi.getPriorities();
  }
}

export async function getRecommendations() {
  if (!USE_REAL_API) return mockApi.getRecommendations();
  try {
    const { data } = await apiClient.get('/api/recommendations');
    return data;
  } catch (err) {
    console.warn('[API] /api/recommendations failed, falling back to mock data:', err.message);
    return mockApi.getRecommendations();
  }
}

export async function getFile(id) {
  if (!USE_REAL_API) return mockApi.getFile(id);
  try {
    const { data } = await apiClient.get(`/api/files/${id}`);
    return data;
  } catch (err) {
    console.warn(`[API] /api/files/${id} failed, falling back to mock data:`, err.message);
    return mockApi.getFile(id);
  }
}

// -------------------------------------------------------------
// Authentication & RBAC APIs
// -------------------------------------------------------------
export async function getAuthMe() {
  try {
    const { data } = await apiClient.get('/api/auth/me');
    return data;
  } catch (err) {
    console.warn('[API] /api/auth/me failed:', err.message);
    return {
      status: 'authenticated',
      user: {
        id: 'usr_lead_01',
        name: 'Dhruv Patel',
        email: 'dhruv.lead@engineering.org',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        role: 'Lead Architect',
        role_code: 'lead_architect',
        permissions: ['prioritize', 'export_jira', 'sync_notion', 'override_weights', 'manage_integrations'],
        team: 'Core Platform & Architecture'
      }
    };
  }
}

export async function getDemoProfiles() {
  try {
    const { data } = await apiClient.get('/api/auth/profiles');
    return data;
  } catch (err) {
    return { profiles: {}, active_profile: {} };
  }
}

export async function loginWithGoogle(credential) {
  const { data } = await apiClient.post('/api/auth/google', { credential });
  return data;
}

export async function exchangeGoogleCode(code) {
  const { data } = await apiClient.post('/api/auth/google/code', { code });
  return data;
}

export async function switchDemoProfile(profile_key) {
  const { data } = await apiClient.post('/api/auth/switch-profile', { profile_key });
  return data;
}

export async function logoutAuth() {
  const { data } = await apiClient.post('/api/auth/logout');
  return data;
}

// -------------------------------------------------------------
// Integrations: Jira & Notion APIs
// -------------------------------------------------------------
export async function getIntegrationsStatus() {
  try {
    const { data } = await apiClient.get('/api/integrations/status');
    return data;
  } catch (err) {
    return {
      google_auth: { service: 'Google OAuth2', configured: false, mode: 'sandbox_mock' },
      jira: { service: 'Atlassian Jira', configured: false, mode: 'sandbox_mock', domain: 'engineering-hub.atlassian.net', project_key: 'DEBT' },
      notion: { service: 'Notion Workspace', configured: false, mode: 'sandbox_mock', database_id: 'notion_db_pei_backlog_2026' }
    };
  }
}

export async function updateIntegrationsConfig(config) {
  const { data } = await apiClient.post('/api/integrations/config', config);
  return data;
}

export async function createJiraIssue(payload) {
  const { data } = await apiClient.post('/api/integrations/jira/create-issue', payload);
  return data;
}

export async function bulkExportJira(payload) {
  const { data } = await apiClient.post('/api/integrations/jira/bulk-export', payload);
  return data;
}

export async function syncNotion(payload) {
  const { data } = await apiClient.post('/api/integrations/notion/sync', payload);
  return data;
}

export async function createNotionReport(payload) {
  const { data } = await apiClient.post('/api/integrations/notion/create-report', payload);
  return data;
}

export { apiClient };
export default apiClient;


