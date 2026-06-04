const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const TOKEN_KEY = 'AUTH_ACCESS_TOKEN';

interface RequestOptions {
  method?: string;
  body?: FormData | object;
  headers?: Record<string, string>;
}

function getAuthToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
}

export function hasAuthToken(): boolean {
  return Boolean(getAuthToken());
}

export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function fetchApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const token = getAuthToken();
  if (token && !requestHeaders.Authorization) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include',
  };

  if (body) {
    if (body instanceof FormData) {
      config.body = body;
      delete requestHeaders['Content-Type'];
    } else {
      config.body = JSON.stringify(body);
    }
  }

  const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'An error occurred');
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: async (username: string, password: string) => {
    const response = await fetchApi<{ success: boolean; user: any; access: string; refresh: string; message: string }>('/auth/login/', {
      method: 'POST',
      body: { username, password },
    });
    if (response.access) {
      setAuthToken(response.access);
    }
    return response;
  },

  register: async (data: { username: string; email: string; password: string; password_confirm: string; first_name?: string; last_name?: string }) => {
    const response = await fetchApi<{ success: boolean; user: any; access: string; refresh: string; message: string }>('/auth/register/', {
      method: 'POST',
      body: data,
    });
    if (response.access) {
      setAuthToken(response.access);
    }
    return response;
  },

  logout: async () => {
    try {
      return await fetchApi<{ success: boolean; message: string }>('/auth/logout/', {
        method: 'POST',
      });
    } finally {
      setAuthToken(null);
    }
  },

  me: () => {
    if (!hasAuthToken()) {
      return Promise.resolve({ authenticated: false, user: null });
    }

    return fetchApi<{ authenticated: boolean; user: any }>('/auth/me/', {
      method: 'GET',
    });
  },
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
