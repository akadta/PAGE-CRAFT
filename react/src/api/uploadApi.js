const BASE = import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, "");

export const uploadImage = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${BASE}/api/upload/image`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json(); // { url }
};

export const uploadImages = async (files) => {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));
  const res = await fetch(`${BASE}/api/upload/images`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json(); // { urls: [] }
};

export const uploadLogo = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${BASE}/api/upload/logo`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json(); // { url }
};

export const resolveUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE}${url}`;
};

export const uploadVideo = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${BASE}/api/upload/video`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json(); // { url }
};
