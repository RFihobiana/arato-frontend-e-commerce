import api from "./api";

const PRODUIT_URL = "/produits";

const getConfig = (isFormData = false) => {
  const token = localStorage.getItem("userToken");
  if (!token) throw new Error("Utilisateur non authentifié");

  const headers = { Authorization: `Bearer ${token}` };
  if (isFormData) headers["Content-Type"] = "multipart/form-data";

  return { headers, withCredentials: true };
};

export const fetchProduits = async () => {
  const res = await api.get(PRODUIT_URL, getConfig());
  return res.data;
};

export const createProduit = async (data) => {
  const res = await api.post(PRODUIT_URL, data, getConfig(true));
  return res.data;
};

export const updateProduit = async (id, data) => {
  const res = await api.post(`${PRODUIT_URL}/${id}?_method=PUT`, data, getConfig(true));
  return res.data;
};

export const deleteProduit = async (id) => {
  const res = await api.delete(`${PRODUIT_URL}/${id}`, getConfig());
  return res.data;
};
