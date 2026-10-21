import api from "./Axios";
export const uploadLogo = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload/logo`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json(); // returns { url }
};
export const templateApi = {
  getAll: (params) => api.get("/templates", { params }),
  getOne: (id) => api.get(`/templates/${id}`),
  getPublic: (id) => api.get(`/templates/public/${id}`),
  create: (data) => api.post("/templates", data),
  update: (id, d) => api.put(`/templates/${id}`, d),
  remove: (id) => api.delete(`/templates/${id}`),
  getActive: () => api.get("/templates/active"),
  activate: (id) => api.patch(`/templates/${id}/activate`, {}),
};
