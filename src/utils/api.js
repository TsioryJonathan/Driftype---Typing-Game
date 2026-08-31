import { API_URL } from './url.js';
import { getToken, clearAuth } from './auth.js';

const headers = () => {
  const h = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
};

export const apiGet = async (path) => {
  const res = await fetch(`${API_URL}${path}`, { headers: headers() });
  if (res.status === 401) { clearAuth(); window.location.href = '/login'; return; }
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
};

export const apiPost = async (path, body) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (res.status === 401) { clearAuth(); window.location.href = '/login'; return; }
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
};

export const apiPut = async (path, body) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (res.status === 401) { clearAuth(); window.location.href = '/login'; return; }
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
};
