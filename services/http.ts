/**
 * HTTP Client with request/response interceptors.
 * All API service files import from this instead of using fetch directly.
 *
 * Features:
 *  - Automatically attaches JWT Bearer token from in-memory Zustand authStore
 *  - Handles 401 → dispatches 'auth:unauthorized' event (no localStorage)
 *  - Centralized error parsing
 *  - Base URL from environment variable
 */

import { getInMemoryToken } from '@/store/authStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestConfig {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean; // e.g. login/register don't need auth header
}

export interface ApiError {
  error: string;
  status: number;
}

// ─── Request Interceptor ──────────────────────────────────────────────────────
function buildHeaders(config: RequestConfig): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config.headers,
  };

  if (!config.skipAuth) {
    const token = getInMemoryToken(); // reads from Zustand module-level memory
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

// ─── Response Interceptor ─────────────────────────────────────────────────────
async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    // Dispatch event — authStore listener will call clearAuth()
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err: ApiError = {
      error: data?.error || `Request failed with status ${response.status}`,
      status: response.status,
    };
    throw err;
  }

  return data as T;
}

// ─── Core Fetch Wrapper ───────────────────────────────────────────────────────
async function request<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const { method = 'GET', body, ...rest } = config;
  const url = `${BASE_URL}${path}`;
  const headers = buildHeaders(rest);

  const options: RequestInit = {
    method,
    headers,
    credentials: 'include', // include HTTP-only cookie
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  return handleResponse<T>(response);
}

// ─── Public HTTP API ──────────────────────────────────────────────────────────
export const http = {
  get: <T>(path: string, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    request<T>(path, { ...config, method: 'GET' }),

  post: <T>(path: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    request<T>(path, { ...config, method: 'POST', body }),

  put: <T>(path: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    request<T>(path, { ...config, method: 'PUT', body }),

  patch: <T>(path: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    request<T>(path, { ...config, method: 'PATCH', body }),

  delete: <T>(path: string, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    request<T>(path, { ...config, method: 'DELETE' }),
};
