import api from "./api";

const PRODUIT_URL = "/produits";

const getConfig = () => {
  const token = localStorage.getItem("userToken");
  return token
    ? { 
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        withCredentials: true
      }
    : { withCredentials: true };
};

export const fetchProduits = async () => {
  try {
    const res = await api.get(PRODUIT_URL, getConfig());
    return res.data;
  } catch (error) {
    console.error("Erreur chargement produits: ", error);
    throw error;
  }
};

export const createProduit = async (produitData) => {
  const token = localStorage.getItem("userToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true
  };
  const res = await api.post(PRODUIT_URL, produitData, config);
  return res.data;
};

export const updateProduit = async (id, produitData) => {
  const token = localStorage.getItem("userToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true
  };
  const res = await api.post(`${PRODUIT_URL}/${id}?_method=PUT`, produitData, config);
  return res.data;
};

export const deleteProduit = async (id) => {
  const res = await api.delete(`${PRODUIT_URL}/${id}`, getConfig());
  return res.data;
};