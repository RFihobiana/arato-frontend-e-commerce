import api from "./api";

const PRODUIT_URL = "/produits";


const getConfig = (isFormData = false) => {
  const token = localStorage.getItem("userToken");
  if (!token) throw new Error("Utilisateur non authentifié");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (isFormData) {
    headers["Content-Type"] = "multipart/form-data";
  } else {
    headers["Content-Type"] = "application/json";
  }

  return {
    headers,
    withCredentials: true,
  };
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
  try {
    const res = await api.post(PRODUIT_URL, produitData, getConfig(true));
    return res.data;
  } catch (error) {
    console.error("Erreur création produit: ", error.response?.data || error.message);
    throw error;
  }
};

export const updateProduit = async (id, produitData) => {
  try {
    const res = await api.post(`${PRODUIT_URL}/${id}?_method=PUT`, produitData, getConfig(true));
    return res.data;
  } catch (error) {
    console.error("Erreur mise à jour produit: ", error.response?.data || error.message);
    throw error;
  }
};

export const deleteProduit = async (id) => {
  try {
    const res = await api.delete(`${PRODUIT_URL}/${id}`, getConfig());
    return res.data;
  } catch (error) {
    console.error("Erreur suppression produit: ", error.response?.data || error.message);
    throw error;
  }
};
