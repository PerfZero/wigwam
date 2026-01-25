const publicBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function apiUrl(path) {
  return `${publicBase}${path}`;
}
