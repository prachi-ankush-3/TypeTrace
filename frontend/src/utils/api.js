const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("tt_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let data = {};
    try {
      data = await response.json();
    } catch {
      // Ignore invalid error bodies.
    }

    if (response.status === 401) {
      localStorage.removeItem("tt_token");
      window.dispatchEvent(new Event("tt:unauthorized"));
    }

    throw new Error(data.detail || "SIGNAL LOST");
  }

  return response.status === 204 ? null : response.json();
}

export const api = {
  register: (x) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(x),
    }),

  login: (x) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(x),
    }),

  me: () => request("/auth/me"),

  tests: () => request("/tests"),

  saveTest: (x) =>
    request("/tests", {
      method: "POST",
      body: JSON.stringify(x),
    }),

  test: (id) => request(`/tests/${id}`),

  stats: () => request("/stats"),

  streak: () => request("/streak"),

  ghost: (id) =>
    request(id ? `/ghost?test_id=${encodeURIComponent(id)}` : "/ghost"),

  ghostPast: () => request("/ghost/past"),

  ghostRaces: () => request("/ghost/races"),

  achievements: () => request("/achievements"),

  profile: () => request("/profile"),

  updateProfile: (x) =>
    request("/profile", {
      method: "PUT",
      body: JSON.stringify(x),
    }),
};
