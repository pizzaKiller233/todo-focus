const BASE = '/api';

async function request(url, options = {}) {
  const { headers: extraHeaders, ...rest } = options;
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    ...rest,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  getTodos: () => request('/todos'),
  createTodo: (text) => request('/todos', {
    method: 'POST',
    body: JSON.stringify({ text }),
  }),
  updateTodo: (id, done) => request(`/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ done }),
  }),
  deleteTodo: (id) => request(`/todos/${id}`, {
    method: 'DELETE',
  }),

  getToday: () => request('/focus/today'),
  addSession: (start_time, seconds) => request('/focus/session', {
    method: 'POST',
    body: JSON.stringify({ start_time, seconds }),
  }),
  deleteSession: (id) => request(`/focus/session/${id}`, {
    method: 'DELETE',
  }),
  getGoal: () => request('/focus/goal'),
  updateGoal: (goal_minutes) => request('/focus/goal', {
    method: 'PUT',
    body: JSON.stringify({ goal_minutes }),
  }),
};
