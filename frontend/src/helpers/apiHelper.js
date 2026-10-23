// Default "/api": saat development lewat proxy Vite, saat produksi dilayani Express yang sama.
// Isi VITE_API_BASE_URL (mis. http://localhost:3000/api) bila front-end dan API beda server.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const TOKEN_KEY = "accessToken";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function putAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export default async function apiHelper(path, { method = "GET", params, body } = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, value);
      }
    });
  }

  const headers = {};
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), { method, headers, body: payload });
  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.error || "Terjadi kesalahan pada server.");
  }
  return json;
}
