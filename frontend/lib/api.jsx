const publicBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const internalBase = process.env.INTERNAL_API_URL || publicBase;

export function apiUrl(path) {
  const base = typeof window === "undefined" ? internalBase : publicBase;
  return `${base}${path}`;
}
