import api from "./api";

const LIVRAISON_URL = "/livraisons";
const FRAIS_URL = "/frais_livraisons";

const getConfig = (isFormData = false) => {
  const token = localStorage.getItem("userToken");
  if (!token) throw new Error("Utilisateur non authentifié");

  const headers = { Authorization: `Bearer ${token}` };
  if (isFormData) headers["Content-Type"] = "multipart/form-data";

  return { headers, withCredentials: true };
};

export const fetchLivraisons = async () => {
  const res = await api.get(LIVRAISON_URL, getConfig());
  return res.data;
};

// Créer une livraison
export const createLivraison = async (data) => {
  const res = await api.post(LIVRAISON_URL, data, getConfig());
  return res.data;
};

// Mettre à jour une livraison
export const updateLivraison = async (id, data) => {
  // Même méthode que pour produit, compatible Laravel PUT simulé
  const res = await api.post(`${LIVRAISON_URL}/${id}?_method=PUT`, data, getConfig());
  return res.data;
};

// Supprimer une livraison
export const deleteLivraison = async (id) => {
  const res = await api.delete(`${LIVRAISON_URL}/${id}`, getConfig());
  return res.data;
};

export const fetchFrais = async () => {
  const res = await api.get(FRAIS_URL);
  return res.data;
};

export const createFrais = async (data) => {
  const res = await api.post(FRAIS_URL, data, getConfig());
  return res.data;
};

export const updateFrais = async (id, data) => {
  const res = await api.post(`${FRAIS_URL}/${id}?_method=PUT`, data, getConfig());
  return res.data;
};

export const deleteFrais = async (id) => {
  const res = await api.delete(`${FRAIS_URL}/${id}`, getConfig());
  return res.data;
};
