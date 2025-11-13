const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function callAPI(url, method = 'GET', data = null) {
  const fullUrl = API_BASE + url;
  const config = {
    method: method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(fullUrl, config);

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(errorText || `HTTP Error: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  return null;
}

export function normalizeUsers(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray(data.users)) return data.users;
  return [];
}

export const GET = (url) => callAPI(url, 'GET');
export const POST = (url, data) => callAPI(url, 'POST', data);
export const PATCH = (url, data) => callAPI(url, 'PATCH', data);
export const DELETE = (url) => callAPI(url, 'DELETE');
