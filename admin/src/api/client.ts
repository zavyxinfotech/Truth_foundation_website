const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function getStoredToken(): string | null {
  return localStorage.getItem('tf_admin_token');
}

export function setStoredToken(token: string) {
  localStorage.setItem('tf_admin_token', token);
}

export function removeStoredToken() {
  localStorage.removeItem('tf_admin_token');
  localStorage.removeItem('tf_admin_user');
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    removeStoredToken();
    window.dispatchEvent(new Event('auth:unauthorized'));
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}
