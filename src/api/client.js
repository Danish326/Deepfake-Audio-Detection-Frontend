const API_BASE = '/api/v1';

function getToken() {
  return localStorage.getItem('access_token');
}

function setToken(token) {
  localStorage.setItem('access_token', token);
}

function removeToken() {
  localStorage.removeItem('access_token');
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = { ...(options.headers || {}) };

  const token = getToken();
  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.json) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.json);
    delete options.json;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await response.json();

  if (!response.ok) {
    const msg = data?.detail?.message || data?.detail || 'Request failed';
    const err = new Error(msg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // ── Auth ──
  async login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const data = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
      skipAuth: true,
    });
    setToken(data.access_token);
    return data;
  },

  async register(username, email, password) {
    const data = await request('/auth/register', {
      method: 'POST',
      json: { username, email, password },
      skipAuth: true,
    });
    return data;
  },

  async getMe() {
    return request('/auth/me');
  },

  logout() {
    removeToken();
  },

  // ── Quota ──
  async getQuotaStatus() {
    return request('/quota/status');
  },

  // ── Predictions ──
  async predictAudio(file) {
    const formData = new FormData();
    formData.append('file', file);
    return request('/predict/audio', {
      method: 'POST',
      body: formData,
    });
  },

  async getHistory(limit = 20) {
    return request(`/predictions/history?limit=${limit}`);
  },

  // ── Health ──
  async getHealth() {
    return request('/health', { skipAuth: true });
  },

  // ── Admin ──
  async getAdminStats() {
    return await request('/admin/stats');
  },

  async getAdminUsers(limit = 50) {
    return await request(`/admin/users?limit=${limit}`);
  },

  async getAdminPredictions(limit = 50) {
    return await request(`/admin/predictions?limit=${limit}`);
  },

  // ── Utility ──
  getToken,
  hasToken: () => !!getToken(),
};
