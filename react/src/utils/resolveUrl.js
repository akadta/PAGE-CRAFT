const BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, "") || "";
export const resolveUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("blob")) return url;
  return `${BASE}${url}`;
};
console.log(import.meta.env.VITE_API_BASE_URL);
