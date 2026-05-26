const BASE_URL = '/api/expenses';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // response body wasn't JSON
    }
    throw new Error(errorMessage);
  }

  // 204 No Content
  if (res.status === 204) return null;

  return res.json();
}

export function getExpenses(filters = {}) {
  const params = new URLSearchParams();

  if (filters.category) params.append('category', filters.category);
  if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.append('dateTo', filters.dateTo);
  if (filters.title) params.append('title', filters.title);

  const query = params.toString();
  const url = query ? `${BASE_URL}?${query}` : BASE_URL;

  return request(url);
}

export function getExpense(id) {
  return request(`${BASE_URL}/${id}`);
}

export function createExpense(data) {
  return request(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateExpense(id, data) {
  return request(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteExpense(id) {
  return request(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
}

export function getMonthlySummary(year, month) {
  return request(`${BASE_URL}/summary/monthly?year=${year}&month=${month}`);
}
