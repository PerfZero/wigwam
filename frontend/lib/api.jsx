const publicBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function apiUrl(path) {
  // В development режиме на сервере используем backend, в браузере - localhost
  const base = typeof window === "undefined" ? "http://backend:8000" : publicBase;
  return `${base}${path}`;
}
