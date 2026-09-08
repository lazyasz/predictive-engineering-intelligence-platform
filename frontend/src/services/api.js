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
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
