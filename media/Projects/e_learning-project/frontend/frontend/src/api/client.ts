const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface RequestOptions {
  method?: string;
  body?: FormData | object;
  headers?: Record<string, string>;
}

async function fetchApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };

  if (body) {
    if (body instanceof FormData) {
      config.body = body;
      delete config.headers['Content-Type'];
    } else {
      config.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'An error occurred');
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    fetchApi<{ success: boolean; user: any; message: string }>('/auth/login/', {
      method: 'POST',
      body: { username, password },
    }),

  register: (data: { username: string; email: string; password: string; password_confirm: string; first_name?: string; last_name?: string }) =>
    fetchApi<{ success: boolean; user: any; message: string }>('/auth/register/', {
      method: 'POST',
      body: data,
    }),

  logout: () =>
    fetchApi<{ success: boolean; message: string }>('/auth/logout/', {
      method: 'POST',
    }),

  me: () =>
    fetchApi<{ authenticated: boolean; user: any }>('/auth/me/', {
      method: 'GET',
    }),
};

// Dashboard API
export const dashboardApi = {
  getDashboard: () =>
    fetchApi<any>('/dashboard/', {
      method: 'GET',
    }),
};

// Folders API
export const folderApi = {
  list: () => fetchApi<any[]>('/folders/', { method: 'GET' }),
  get: (id: number) => fetchApi<any>(`/folders/${id}/`, { method: 'GET' }),
  create: (data: FormData) =>
    fetchApi<any>('/folders/', {
      method: 'POST',
      body: data,
    }),
  update: (id: number, data: FormData) =>
    fetchApi<any>(`/folders/${id}/`, {
      method: 'PUT',
      body: data,
    }),
  delete: (id: number) =>
    fetchApi<any>(`/folders/${id}/`, {
      method: 'DELETE',
    }),
};

// Files API
export const fileApi = {
  list: () => fetchApi<any[]>('/files/', { method: 'GET' }),
  get: (id: number) => fetchApi<any>(`/files/${id}/`, { method: 'GET' }),
  upload: (data: FormData) =>
    fetchApi<any>('/files/', {
      method: 'POST',
      body: data,
    }),
  delete: (id: number) =>
    fetchApi<any>(`/files/${id}/`, {
      method: 'DELETE',
    }),
};

// Texts API
export const textApi = {
  list: () => fetchApi<any[]>('/texts/', { method: 'GET' }),
  get: (id: number) => fetchApi<any>(`/texts/${id}/`, { method: 'GET' }),
  create: (data: { title: string; content: string; font_family: string; folder?: number }) =>
    fetchApi<any>('/texts/', {
      method: 'POST',
      body: data,
    }),
  update: (id: number, data: { title?: string; content?: string; font_family?: string; folder?: number }) =>
    fetchApi<any>(`/texts/${id}/`, {
      method: 'PUT',
      body: data,
    }),
  delete: (id: number) =>
    fetchApi<any>(`/texts/${id}/`, {
      method: 'DELETE',
    }),
};

export default API_BASE_URL;
