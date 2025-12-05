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
    let errorMessage = `HTTP Error: ${response.status}`;
    try {
      const errorData = await response.json();
      // Backend returns { error: "message" }
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // If not JSON, try to get text
      const errorText = await response.text().catch(() => response.statusText);
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return null;
}

// Normalize paginated response from backend
// Backend returns: { data: [...], pagination: { total, page, pageSize, totalPages } }
export function normalizePaginatedResponse(response) {
  if (response && response.data && Array.isArray(response.data)) {
    return {
      items: response.data,
      total: response.pagination?.total || 0,
      page: response.pagination?.page || 1,
      pageSize: response.pagination?.pageSize || 20,
      totalPages: response.pagination?.totalPages || 0
    };
  }
  // Fallback for non-paginated arrays
  if (Array.isArray(response)) {
    return {
      items: response,
      total: response.length,
      page: 1,
      pageSize: response.length,
      totalPages: 1
    };
  }
  return {
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0
  };
}

export function normalizeUsers(data) {
  // Backend actual retorna: { data: [...], pagination: {...} }
  if (data && data.data && Array.isArray(data.data)) {
    return data.data;
  }
  // Fallback para array directo
  if (Array.isArray(data)) return data;
  return [];
}

// Helper to fetch user by ID and return username
export async function getUsernameById(userId) {
  if (!userId) return '';
  try {
    const data = await callAPI(`/users?user_id=${encodeURIComponent(userId)}`, 'GET');
    const list = normalizeUsers(data);
    return list[0]?.username || userId;
  } catch {
    return userId;
  }
}

// Helper to find user by email
export async function findUserByEmail(email) {
  if (!email || !email.includes('@')) return null;
  try {
    const data = await callAPI(`/users?email=${encodeURIComponent(email)}`, 'GET');
    const list = normalizeUsers(data);
    return list.length > 0 ? list[0] : null;
  } catch {
    return null;
  }
}

export const GET = (url) => callAPI(url, 'GET');
export const POST = (url, data) => callAPI(url, 'POST', data);
export const PATCH = (url, data) => callAPI(url, 'PATCH', data);
export const DELETE = (url) => callAPI(url, 'DELETE');
