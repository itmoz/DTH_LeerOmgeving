const defaultApiBase = import.meta.env.DEV
  ? "https://localhost:3000"
  : "https://localhost:3000";

export const API_BASE_URL = (import.meta.env.VITE_API_URL || defaultApiBase).replace(/\/$/, "");

export function apiUrl(path = "") {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
